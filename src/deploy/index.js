#!/usr/bin/env node
import minimist from 'minimist';
import chalk from 'chalk';
import { exec, execSync } from 'child_process';
import load from '../../utils/load.js';
import execReturn from '../../utils/execReturn.js';
import GitException from '../../Exceptions/GitException.js';

const deploy = async () => {
  const {
    from = execSync('git branch --show-current').toString(), branch, push, remove, remote,
  } = minimist(process.argv.slice(2));

  if (!branch) {
    console.log(chalk.hex('#FF2400').bold('You must specify a branch to be merged.'));
    console.log(chalk.hex('#FFFF00').bold('Example: deploy --branch master '));
    throw new Error('Branch not specified ');
  }

  const gitCheckout = load(`Checkouting to ${branch}..`);
  const gitMerge = load(`Merging ${from} into ${branch}..`);
  const gitPush = load(`Pushing ${branch}`);
  const gitRemove = load(`Removing ${branch} from remote`);
  const deployFinish = load('Finishing deploy..');

  console.log(chalk.hex('150 200 0').bold('Starting deploy'));

  gitCheckout.start();

  await new Promise((resolve) => {
    setTimeout(() => {
      exec(`git checkout ${branch}`, execReturn);
      gitCheckout.succeed();
      resolve();
    }, 1000);
  }).then();

  gitMerge.start();

  await new Promise((resolve) => {
    setTimeout(() => {
      exec(`git merge ${from}`, execReturn);
      gitMerge.succeed();
      resolve();
    }, 1000);
  });

  if (push) {
    gitPush.start();
    await new Promise((resolve) => {
      setTimeout(() => {
        if (!remote) {
          console.log(chalk.hex('#FF2400').bold('Remote not specified. To specify a remote please use --remote'));
          throw new GitException('Remote not specified.');
        }
        exec(`git push ${remote} ${branch}`, execReturn);
        gitPush.succeed();
        resolve();
      }, 1000);
    });
  }
  deployFinish.start();

  await new Promise((resolve) => {
    setTimeout(() => {
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
      deployFinish.succeed();
      console.log(chalk.greenBright('Deployed Succesfully!'));
      resolve();
    }, 2000);
  });
};

export default deploy;
