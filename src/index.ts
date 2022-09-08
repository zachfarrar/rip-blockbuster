#!/usr/bin/env node

import { Customer } from "./Customer";
import { MovieCollection } from "./Movie";

import { Command } from "commander";
import { htmlStatement, statement } from "./statement";

const program: Command = new Command();
const version: string = require("../package.json").version;

const customer: Customer = require("./data/customer.json");
const movies: MovieCollection = require("./data/movies.json");

program
  .version(version)
  .description("A CLI for generating customer statements");

program
  .command("statement")
  .description("Prints out a plain-text statement for the customer")
  .action(() => console.log(statement(customer, movies)))
  .command("hmtl-statement")
  .description("Prints out an html statement for the customer")
  .action(() => console.log(htmlStatement(customer, movies)));

program.parse(process.argv);
