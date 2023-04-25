#!/usr/bin/env node
import minimist from 'minimist';
import chalk from 'chalk';
import { exec, execSync } from 'child_process';
import load from '../../utils/load.js';
import execReturn from '../../utils/execReturn.js';
import GitException from '../../Exceptions/GitException.js';

export default function () {
  const {
    from = execSync('git branch --show-current').toString(), branch, push, remove, remote,
  } = minimist(process.argv.slice(2));

  if (!branch) {
    console.log(chalk.hex('#FF2400').bold('You must specify a branch to be merged.'));
    console.log(chalk.hex('#FFFF00').bold('Example: deploy --branch master '));
    throw new Error('Branch not specified ');
  }

  const gitCheckout = load(`Checkouting to ${from}..`);
  const gitMerge = load(`Merging ${from} into ${branch}..`);
  const gitPush = load(`Pushing ${branch}`);
  const gitRemove = load(`Removing ${branch} from remote`);

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
  } else if (remove) {
    gitRemove.start();

    if (!remote) {
      console.log(chalk.hex('#FF2400').bold('Remote not specified. To specify a remote please use --remote'));
      throw new GitException('Remote not specified.');
    }
    exec(`git branch -d ${from}`);
    exec(`git push ${remote} -d ${from}`);
    setTimeout(() => {
      gitRemove.succeed();
    }, 1000);
  }

  console.log(chalk.greenBright('Deployed Succesfully!'));
}
