import loading from "loading-cli";

import Questions from "../lib/questions/index.js";

export default class Loading{
  constructor(questions){
    this.questions = questions
  }

  async checkoutDestinationLoad(){
    return loading(`checkouting to ${this.questions.destinationBranch}`)
  }

  async checkoutSourceLoad(){
    return loading(`checkouting to ${this.questions.sourceBranch}`)
  }

  async mergeBranchesLoad(){
    return loading(`merging ${this.questions.sourceBranch} into ${this.questions.destinationBranch}`)
  }

  async pushToRemoteLoad(){
    return loading(`pushing ${this.questions.destinationBranch} to ${this.questions.remote}`)
  }

  async createTagLoad(){
    return loading(`creating tag ${this.questions.tag}`)
  }

  async updateTagLoad(){
    return loading(`updating tag to ${this.questions.tag}`)
  }

  async removeSourceBranchLoad(){
    return loading(`removing ${this.questions.sourceBranch}`)
  }
}

