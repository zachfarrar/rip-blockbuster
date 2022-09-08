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
  .option("-h, --html", 'flag that determines whether to output in html or plaintext')
  .action((options) => {
    const printString = options.html ? htmlStatement(customer, movies) : statement(customer, movies);
    console.log(printString);
  });

program.parse(process.argv);
