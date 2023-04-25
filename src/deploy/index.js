#!/usr/bin/env node
import minimist from 'minimist';
import chalk from 'chalk';
import { exec, execSync } from 'child_process';
import load from '../../utils/load.js';
import execReturn from '../../utils/execReturn.js';

const deploy = () => {
  const {
    from = execSync('git branch --show-current').toString(), branch, push, remove,
  } = minimist(process.argv.slice(2));

  if (!branch) {
    console.log(chalk.hex('#FF2400').bold('You must specify a branch to be merged.'));
    console.log(chalk.hex('#FFFF00').bold('Example: deploy --branch master '));
    throw new Error('Branch not specified ');
  }

  const gitCheckout = load(`Checkouting to ${from}..`);
  const gitMerge = load(`Merging ${from} into ${branch}..`);
  const gitPush = load(`Pushing ${branch}`);

  console.log(chalk.rgb('150 200 0').bold('Starting deploy'));

  gitCheckout.start();

  exec(`git checkout ${branch}`, execReturn);

  setTimeout(() => {
    gitCheckout.succeed();
  }, 1000);

  gitMerge.start();
  exec(`git merge ${from} ${branch}`, execReturn);
  setTimeout(() => {
    gitMerge.succeed();
  }, 1000);

  if (push) {
    gitPush.start();
    exec(`git push ${branch}`, execReturn);
    setTimeout(() => {
      gitPush.succeed();
    }, 1000);
  }

  if (from === 'develop' || from === 'dev') {
    exec(`git checkout ${from}`);
  }

  console.log(chalk.greenBright('Deployed Succesfully!'));
};

export default deploy;
