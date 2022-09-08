import { Customer } from "./Customer";
import { MovieCode, MovieCollection } from "./Movie";

type MoviesAndAmounts = {
  movies: {[idx: string]: number};
  frequentRenterPoints: number;
  totalAmountDue: number;
};

export const statement = (customer: Customer, movies: MovieCollection): string => {
  let result = `Rental Record for ${customer.name}\n`;

  let movieAndAmounts = calculateMoviePrice(customer, movies);
  for (const title in movieAndAmounts.movies) {
    result += `\t${title}\t${movieAndAmounts.movies[title]}\n`
  }
  
  result += `Amount owed is ${movieAndAmounts.totalAmountDue}\n`;
  result += `You earned ${movieAndAmounts.frequentRenterPoints} frequent renter points\n`;

  return result;
};

export const htmlStatement = (customer: Customer, movies: MovieCollection): string => {
  let result = `<h1>Rental Record for <em>${customer.name}</em></h1>\n<ul>\n`;

  let movieAndAmounts = calculateMoviePrice(customer, movies);
  for (const title in movieAndAmounts.movies) {
    result += `\t<li>${title}\t${movieAndAmounts.movies[title]}</li>\n`
  }
  
  result += `</ul>\n<p>Amount owed is <em>${movieAndAmounts.totalAmountDue}</em></p>\n`;
  result += `<p>You earned <em>${movieAndAmounts.frequentRenterPoints}</em> frequent renter points</p>\n`;

  return result;
};


const calculateMoviePrice = (customer: Customer, movies: MovieCollection): MoviesAndAmounts => {
  let movieAndAmounts: MoviesAndAmounts = {
    movies: {},
    frequentRenterPoints: 0,
    totalAmountDue: 0
  };
  for (const r of customer.rentals) {
    let movie = movies[r.movieID];
    let thisAmount = 0;

    switch (movie.code) {
      case MovieCode.REGULAR:
        thisAmount = 2;
        if (r.days > 2) {
          thisAmount += (r.days - 2) * 1.5;
        }
        break;
      case MovieCode.NEW:
        thisAmount = r.days * 3;
        break;
      case MovieCode.CHILDRENS:
        thisAmount = 1.5;
        if (r.days > 3) {
          thisAmount += (r.days - 3) * 1.5;
        }
        break;
    }
    movieAndAmounts.movies[movie.title] = thisAmount;
    movieAndAmounts.frequentRenterPoints++;
    if (movie.code === MovieCode.NEW && r.days > 2) movieAndAmounts.frequentRenterPoints++;
    movieAndAmounts.totalAmountDue += thisAmount;
  }
  return movieAndAmounts;
};