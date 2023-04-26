import chalk from 'chalk';
import GitException from '../Exceptions/GitException.js';

const execReturn = (err) => {
  if (err) {
    console.log(chalk.red(err));
    throw new GitException('Error on git');
  }
};

export default execReturn;
