import chalk from 'chalk';
import GitException from '../Exceptions/GitException.js';

const execReturn = (err, stdout, stderr) => {
  if (err) {
    console.log(chalk.red(err));
    throw new GitException('Error on git');
  }

  if (stdout) {
    console.log(chalk.yellow(stdout));
  }

  if (stderr) {
    console.log(chalk.yellow(stderr));
  }
};

export default execReturn;
