# FIFA World Cup 2026 Draw Simulator

## Overview

This is a Vue web application designed to simulate the draw for the 2026 edition of the men's FIFA World Cup in Canada, Mexico and the United States. My main inspiration was a similar program used to simulate the draw for the 2018 edition of the tournament, which was hosted on a newspaper's website.

Please go to the "running the application" section on how to launch the application in a local environment.

<img width="1900" height="952" alt="Screenshot of final version" src="https://github.com/user-attachments/assets/f6eb2a02-4903-4f27-8bc5-30631b03886f" />

## Important notes

This program may produce results that do not comply with the requirements of the official draw (e.g., two or more teams from the same football confederation being drawn to the same group). I implemented a failsafe to place a drawn team into the last available group if there's no other group for the team to enter, and from personal use of the application I have seen the number of valid group matchups range between 8 and 12 out of 12 groups with the current draw algorithm I implemented, and this is something I did not resolve in time for the final draw (which took place on December 5th 2025).

After running the draw you will see two sets of tables appear below the drawn groups.

- The first shows the order teams were drawn and the groups they were placed into (groups in this table are colour coded)
- The second shows the number of confederations drawn into each group, with the following key for each row:
  - Green if the teams in the group complies with the draw's confederation restrictions (either 1 or 2 UEFA teams, and at most 1 team from every other confederation)
  - Red if there is an invalid combination of teams in the group (e.g., 0 or 3 UEFA teams, 2 or more teams from any other confederation)
 
When running the program you may see some errors appear at the bottom half of the page. These do not impact use of the program and can be hidden by clicking the "close" button on the bottom left-hand corner of the page.

## Running the application

The application may need some dependencies to be installed before it can be run. To do so, navigate to the application's root folder and type the following command:

```bash
npm install
```

To run the application, enter the following:

```bash
npm run dev
```
