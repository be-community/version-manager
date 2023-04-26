#!/usr/bin/env node
import chalk from 'chalk';
import publish from './lib/publish/index.js';

const functions = {
  publish,
};

if (!functions[process.argv.slice(2)[0]]) {
  console.log(chalk.red('Command not found'));
  throw new Error();
}

functions[process.argv.slice(2)[0]]();
