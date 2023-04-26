import chalk from "chalk";

export default function logQuestionResponse({ text, response }) {
  console.log(
    `${chalk.hex("#0000ff").bold(text)} ${chalk.redBright(response)}`
  );
}
