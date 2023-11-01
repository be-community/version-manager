import { execSync } from "child_process";
import logQuestionResponse from "../../utils/logQuestionResponse.js";

export default class Questions {
  constructor(prompt) {
    this.prompt = prompt;
  }

  async publish() {
    await this.originSelect();
    await this.sourceBranchSelect();
    await this.destinationBranchSelect();
    await this.wantsPush();
    await this.removeFromBranch();
    await this.tagCreation();
  }

  async originSelect() {
    const remotes = execSync("git remote")
      .toString()
      .split("\n")
      .map((remote) => ({
        name: remote,
      }));

    const choice = await this.prompt.choice(
      "Which remote do you want to use?",
      remotes
    );

    logQuestionResponse({
      text: "Remote selected:",
      response: choice,
    });

    this.remote = choice;
  }

  async sourceBranchSelect() {
    const branches = execSync("git branch --sort=-worktreepath")
      .toString()
      .split("\n")
      .map((branch) => ({
        name: branch.replace("*", "").trim(),
      }));

    const choice = await this.prompt.choice(
      "Which source branch do you want to merge into the destination branch?",
      branches
    );

    logQuestionResponse({
      text: "Source Branch selected:",
      response: choice,
    });

    this.sourceBranch = choice;
  }

  async destinationBranchSelect() {
    const branches = execSync("git branch --sort=-worktreepath")
      .toString()
      .split("\n")
      .map((branch) => ({
        name: branch.replace("*", "").trim(),
      }))
      .filter((branch) => branch.name !== this.sourceBranch);

    const choice = await this.prompt.choice(
      "Which destination branch do you want to merge your source branch into?",
      branches
    );

    logQuestionResponse({
      text: "Destination Branch selected:",
      response: choice,
    });

    this.destinationBranch = choice;
  }

  async wantsPush() {
    const choice = await this.prompt.confirm(
      "Do you want to push your changes to the remote repository?"
    );

    logQuestionResponse({
      text: "it will push:",
      response: choice,
    });

    this.push = choice;
  }

  async removeFromBranch() {

    if(['master', 'main', 'develop', 'stage'].includes(this.sourceBranch)){
      return this.remove = false
    }
    const choice = await this.prompt.confirm(
      "Do you want to remove the source branch?"
    );

    logQuestionResponse({
      text: "it will to remove the source branch:",
      response: choice,
    });

    this.removeBranch = choice;
  }

  async tagCreation() {
    const existingTags = execSync(`git ls-remote --tags origin`).toString()

    if(!this.push){
      return this.tag = null
    }
    console.log(!existingTags, existingTags)
    if(!existingTags){
      return this.tag = '1.0.0'
    }
    const options = {
      stage: [
        {
          name: "premajor",
          hint: "version before a major release that is still in development. vX.x.x-x",
        },
        {
          name: "preminor",
          hint: "version before a minor release that is still in development. vx.X.x-x",
        },
        {
          name: "prepatch",
          hint: "version before a patch release that is still in development. vx.x.X-x",
        },
        {
          name: "prerelease",
          hint: "version before a stable release that is still in development. vx.x.x-X",
        },
        {
          name: "Not a version", hint: "Select this to not create a tag"
        }
      ],
      default: [
        {
          name: "major",
          hint: "significant changes, compatibility impact. vX.x.x",
        },
        {
          name: "minor",
          hint: "small changes, new features, improvements. vx.X.x",
        },
        { name: "patch", hint: "bug fixes, minor changes. vx.x.X" },
        {
          name: "Not a version", hint: "Select this to not create a tag"
        }
      ],
    };

    const choice = await this.prompt.choice(
      "Which release version do you want to tag?",
      options[this.from === "stage" ? this.from : "default"]
    );

    logQuestionResponse({
      text: "Selected release version:",
      response: choice,
    });

    this.tag = choice;
  }
}
