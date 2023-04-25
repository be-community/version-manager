#!/usr/bin/env node
import chalk from 'chalk';
import deploy from './src/deploy/index.js';

const functions = {
  deploy,
};

if (!functions[process.argv.slice(2)[0]]) {
  console.log(chalk.red('Command not found'));
  throw new Error();
}
functions[process.argv.slice(2)[0]]();
