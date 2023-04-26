import chalk from "chalk";
import delay from "../../utils/delay.js";
import Loading from "../../utils/load.js";
import Questions from "../questions/index.js";
import execReturn from "../../utils/execReturn.js";
import { exec, execSync } from "child_process";

export default class Proccess {
  constructor(questions) {
    this.questions = questions;
    this.loading = new Loading(this.questions);
  }

  async commands() {
    console.log(chalk.hex('#00ff80').bold('Starting deploy!'))
    await this.checkoutDestinationBranch();

    await this.mergeBranches();

    await this.pushToRemote();

    await this.createTag();

    await this.updateTag();

    await this.checkoutSourceBranch();
  }

  async checkoutDestinationBranch() {
    const load = (await this.loading.checkoutDestinationLoad()).start()


    await delay(() => {
      exec(`git checkout ${this.questions.destinationBranch}`, execReturn)
      load.succeed()
    }, 2000)
  }

  async checkoutSourceBranch(){
    if(this.questions.removeBranch){
      return
    }
    const load = (await this.loading.checkoutSourceLoad()).start()


    await delay(() => {
      exec(`git checkout ${this.questions.sourceBranch}`, execReturn)
      load.succeed()

    }, 2000)
  }

  async mergeBranches(){
    const load = (await this.loading.mergeBranchesLoad()).start()


    await delay(() => {
      exec(`git merge ${this.questions.sourceBranch} ${this.questions.destinationBranch}`, execReturn)
      load.succeed()

    }, 2000)
  }

  async pushToRemote(){
    if(!this.questions.push){
      return
    }
    const load = (await this.loading.pushToRemoteLoad()).start()

    await delay(() => {
      exec(`git push ${this.questions.remote} ${this.questions.destinationBranch}`, execReturn)
      load.succeed()

    }, 2000)
  }

  async createTag(){
    if(!this.questions.tag){
      return
    }
    const load = (await this.loading.createTagLoad()).start()

    await delay(() => {
      exec(`npm version ${this.questions.tag} --allow-same-version=true`, execReturn)
      load.succeed()
    }, 2000)
  }

  async updateTag(){
    if(!this.questions.push || !this.questions.tag){
      return
    }
    const load = (await this.loading.updateTagLoad()).start()
    await delay(() => {
      const newtag = execSync(`git describe --tags --abbrev=0`).toString()

      execSync(`git push ${this.questions.remote} ${newtag}`, {stdio: 'ignore'})
      exec(`git push ${this.questions.remote} ${this.questions.destinationBranch}`, execReturn)
      load.succeed()
    },5000)
  }

  async removeSourceBranch(){
    if(!this.questions.removeBranch){
      return
    }

    const load = (await this.loading.removeSourceBranchLoad()).start()
    await delay(() => {
      exec(`git branch -D ${this.questions.sourceBranch}`, execReturn)
      load.succeed()
    }, 2000)
  }
}
