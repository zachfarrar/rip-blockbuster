import { Customer } from "./Customer";
import { MovieCode, MovieCollection } from "./Movie";

type MoviesAndAmounts = {
  movies: {[idx: string]: number};
  frequentRenterPoints: number;
  totalAmountDue: number;
};

const db = require('./data/data-store.json');

export const statement = (customer: Customer, movies: MovieCollection): string => {
  let result = `Rental Record for ${customer.name}\n`;

  const movieAndAmounts = calculateMoviePrice(customer, movies);
  for (const title in movieAndAmounts.movies) {
    result += `\t${title}\t${movieAndAmounts.movies[title]}\n`
  }
  
  result += `Amount owed is ${movieAndAmounts.totalAmountDue}\n`;
  result += `You earned ${movieAndAmounts.frequentRenterPoints} frequent renter points\n`;

  return result;
};

export const htmlStatement = (customer: Customer, movies: MovieCollection): string => {
  let result = `<h1>Rental Record for <em>${customer.name}</em></h1>\n<ul>\n`;

  const movieAndAmounts = calculateMoviePrice(customer, movies);
  for (const title in movieAndAmounts.movies) {
    result += `\t<li>${title} - ${movieAndAmounts.movies[title]}</li>\n`
  }
  
  result += `</ul>\n<p>Amount owed is <em>${movieAndAmounts.totalAmountDue}</em></p>\n`;
  result += `<p>You earned <em>${movieAndAmounts.frequentRenterPoints}</em> frequent renter points</p>\n`;

  return result;
};

const calculateMoviePrice = (customer: Customer, movies: MovieCollection): MoviesAndAmounts => {
  const movieAndAmounts: MoviesAndAmounts = {
    movies: {},
    frequentRenterPoints: 0,
    totalAmountDue: 0
  };

  for (const rental of customer.rentals) {
    let movie = movies[rental.movieID];

    const rentalData = db[movie.code];
    let thisAmount = rentalData.startingPrice;
    if (rental.days > rentalData.rentalDays) {
      thisAmount += (rental.days - rentalData.rentalDays) * rentalData.overdueMultiplier;
    }

    movieAndAmounts.movies[movie.title] = thisAmount;
    movieAndAmounts.frequentRenterPoints += rentalData.pointsPerDay;
    if (rentalData.daysForPoints && rental.days > rentalData.daysForPoints) {
      movieAndAmounts.frequentRenterPoints += rentalData.bonusPoints;
    }
    movieAndAmounts.totalAmountDue += thisAmount;
  }
  return movieAndAmounts;
};