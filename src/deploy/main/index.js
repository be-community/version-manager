#!/usr/bin/env node
import minimist from 'minimist';
import chalk from 'chalk';
import loading from 'loading-cli';
import { exec } from 'child_process';

const load = (loadText) => loading(loadText);

const deployMain = () => {
  const { from = 'develop', branch = 'main' } = minimist(process.argv.slice(2));

  const gitCheckout = load(`Checkouting to ${from}..`);

  const gitMerge = load(`Merging ${from} into ${branch}..`);

  console.log(chalk.hex('150 200 0').bold('Starting deploy'));

  gitCheckout.start();

  exec(`git checkout ${from}`);

  setTimeout(() => {
    gitCheckout.succeed();
  }, 1000);
};

deployMain();
