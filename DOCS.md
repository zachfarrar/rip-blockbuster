# Design Decisions

## Print Output in HTML

In order to print the statement in HTML, I refactored `statement.ts`. I recognized that the for loop which contains all of the calculations
in it would need to be used multiple times, so rather than copy and pasting into an entirely new method, I pulled it out into its own method.
I then used this method in both statement and htmlStatement. There was a slight performance trade-off here - we are calculating everything at
the same time in calculateMoviePrice, then returning all of that data. Since we are returning an object with an array inside of it, we have
to then loop a second time to generate the report. The code still runs in Linear time so I figured the added readability of the second loop
would be a pretty good trade.

## Make Pricing More Flexible

To make the pricing / points / categories system more flexible, I decided the best approach would be to use some kind of in-memory database.
This would allow us to update data for future statements. I found 6 data points that were relevant to each movie category:

- startingPrice: The price that it costs to rent the movie initially
- rentalDays: The number of days until the rental is overdue
- overdueMultiplier: The amount that the starting price is multiplied by for each day after "rentalDays"
- daysForPoints: The number of days it takes until you earn bonus points for your rental (nullable)
- pointsPerDay: This is a bit of a misnomer, but it is the amount of points you earn for your rental before "daysForPoints"
- bonusPoints: The number of bonus points that is earned after "daysForPoints"

These data points are plugged into formulas for the price of the movie rental and the number of frequent renter points earned.

Once I had created the database schema, I plugged my new data points into the functions in statement.ts. Then I realized that for it to really
be flexible, I'd need to add a way for rip-blockbuster employees to update the data. I created a CLI for interacting with the database.
Currently it only interacts with the movie categories. It gives rip-blockbuster employees the ability to create, read, update, and delete
categories in the database. I started by making each CRUD operation its own flag, then I created a prompt system that loops until the
rip-blockbuster employee types exit. Since the prompt system is able to perform any CRUD operation and is more user friendly than the command flags,
this is the only command included in package.json.

## Tech Debt

Once rip-blockbuster becomes a big company, this solution will definitely **NOT** scale well. In-memory databases are extremely ineffective for distributed systems.
We will need to go back and create a database which can store all of our data, not just the movie categories. The good news is that the CRUD operations are
implemented in such a way that the only thing that will need to change is the way we retrieve the data.

I would like to add a UI for my employees that are somewhat less tech savvy. The CLI tool is efficient and effective, but as the company and data scales it would make
more sense to have a website or application where employees can go to interact with the data and create statements.

I would like to add unit tests before MVP release.
