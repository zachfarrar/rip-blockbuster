import { MovieId } from "./Movie";

export interface Rental {
  movieID: MovieId;
  days: number;
}

export interface Customer {
  name: string;
  rentals: Rental[];
}
