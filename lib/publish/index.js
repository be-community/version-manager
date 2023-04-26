#!/usr/bin/env node
import { Prompt } from "@poppinss/prompts";
import Questions from "../questions/index.js";
import Proccess from "../proccess/index.js";

const publish = async () => {
  const questions = new Questions(new Prompt());

  await questions.publish();
  await new Proccess(questions).commands();

};

export default publish;
