import { Command } from "commander";
import { cliTool, createCategory, deleteCategory, readCategory, updateCategory } from "./crud";

const program: Command = new Command();
const version: string = require("../package.json").version;

program
  .version(version)
  .description("A CLI for generating customer statements");

program
  .command("cli")
  .description("Prints out a plain-text statement for the customer")
  .option("-c, --create <name>", "add category <name>")
  .option("-r, --read <name>", "get category <name>")
  .option("-u, --update <name>")
  .option("-d, --delete <name>", "delete category <name>")
  .argument("[startingPrice]")
  .argument("[rentalDays]")
  .argument("[overdueMultiplier>]")
  .argument("[pointsPerDay]")
  .argument("[daysForPoints]")
  .argument("[bonusPoints]")
  .action((startingPrice, rentalDays, overdueMultiplier, pointsPerDay, daysForPoints, bonusPoints, options) => {
    if (options.create) {
      createCategory(options.add, startingPrice, rentalDays, overdueMultiplier, pointsPerDay, daysForPoints, bonusPoints);
    } else if (options.read) {
      readCategory(options.read);
    } else if (options.update) {
      updateCategory(options.update, startingPrice, rentalDays, overdueMultiplier, pointsPerDay, daysForPoints, bonusPoints);
    } else if (options.delete) {
      deleteCategory(options.delete);
    } else {
      cliTool();
    }
  });

program.parse(process.argv);