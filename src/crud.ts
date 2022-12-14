import * as fs from 'fs';
import * as path from 'path';
import PromptSync from 'prompt-sync';

const pathToDb = path.join(__dirname, '../data/data-store.json');

let db = require(pathToDb);

export const createCategory = (name: string, startingPrice: number = 0, rentalDays: number = 0, overdueMultiplier: number = 0, pointsPerDay: number = 0, daysForPoints: number | null = null, bonusPoints: number = 0) => {
  db[name] = {
    startingPrice: isNaN(+startingPrice) ? 0 : +startingPrice,
    rentalDays: isNaN(+rentalDays) ? 0 : +rentalDays,
    overdueMultiplier: isNaN(+overdueMultiplier) ? 0 : +overdueMultiplier,
    pointsPerDay: isNaN(+pointsPerDay) ? 0 : +pointsPerDay,
    daysForPoints: daysForPoints ? +daysForPoints : null,
    bonusPoints: isNaN(+bonusPoints) ? 0 : +bonusPoints
  };

  fs.writeFileSync(pathToDb, JSON.stringify(db));

  return db[name];
};

export const readCategory = (name: string) => {
  return db[name];
};

export const updateCategory = (name: string, startingPrice: number = 0, rentalDays: number = 0, overdueMultiplier: number = 0, pointsPerDay: number = 0, daysForPoints: number | null, bonusPoints: number) => {
  let category = db[name];
  if (!category) {
    return 'No matching category in the database! Please create the category first.';
  }
  category.startingPrice = isNaN(+startingPrice) ? 0 : +startingPrice;
  category.rentalDays = isNaN(+rentalDays) ? 0 : +rentalDays;
  category.overdueMultiplier = isNaN(+overdueMultiplier) ? 0 : +overdueMultiplier;
  category.pointsPerDay = isNaN(+pointsPerDay) ? 0 : +pointsPerDay;
  category.daysForPoints = daysForPoints ? +daysForPoints : null;
  category.bonusPoints = isNaN(+bonusPoints) ? 0 : +bonusPoints;

  db[name] = category;
  fs.writeFileSync(pathToDb, JSON.stringify(db));

  return db[name];
};

export const deleteCategory = (name: string) => {
  const category = db[name];
  delete db[name];

  fs.writeFileSync(pathToDb, JSON.stringify(db));

  return category;
};

export const cliTool = async () => {
  const validOptions = new Set(["create", "read", "update", "delete"]);
  const cli = PromptSync();
  const getAllInputs = () => {
    const name = cli('What is the name of the movie category? ').toLowerCase();
    const startingPrice = Number(cli('What is the price to rent movies in this category? '));
    const rentalDays = Number(cli('How many days until they are due? '));
    const overdueMultiplier = Number(cli('How much should the amount due be multiplied by each day after the movie is due? '));
    const pointsPerDay = Number(cli('How many frequent renter points do you earn for renting a movie in this category? '));
    const daysForPoints = Number(cli('How many days until you earn bonus frequent renter points for this category? '));
    const bonusPoints = Number(cli('How many bonus points are awarded for movies in this category? '));
    return { name, startingPrice, rentalDays, overdueMultiplier, pointsPerDay, daysForPoints, bonusPoints };
  };
  const getNameInput = (read: boolean) => {
    return cli(`What is the name of the category you wish to ${read ? 'read' : 'delete'}? `);
  };
  let input = cli('What would you like to do? Valid options are "create", "read", "update", and "delete". Type "exit" to quit. ');
  while (input !== 'exit') {
    if (!validOptions.has(input)) {
      console.log('You must input a valid option');
    } else {
      if (input === 'create') {
        const data = getAllInputs();
        console.log(createCategory(data.name, data.startingPrice, data.rentalDays, data.overdueMultiplier, data.pointsPerDay, data.daysForPoints, data.bonusPoints));
      }
      else if (input === 'read') {
        console.log(readCategory(getNameInput(true)));
      }
      else if (input === 'update') {
        const data = getAllInputs();
        console.log(updateCategory(data.name, data.startingPrice, data.rentalDays, data.overdueMultiplier, data.pointsPerDay, data.daysForPoints, data.bonusPoints));
      }
      else if (input === 'delete') {
        console.log(deleteCategory(getNameInput(false)));
      }
    }
    input = cli('What would you like to do? Valid options are "create", "read", "update", and "delete". Type "exit" to quit. ');
  }
};