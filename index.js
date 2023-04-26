#!/usr/bin/env node
import { Prompt } from "@poppinss/prompts";
import Questions from "./lib/questions/index.js";
import Proccess from "./lib/proccess/index.js";


const questions = new Questions(new Prompt());

await questions.publish();
await new Proccess(questions).commands();

