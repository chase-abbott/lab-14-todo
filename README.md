Express Server with SQL on Heroku
===

## Getting started

### Initial Setup

1. Create a new GitHub repo from this template
1. Clone your repo down, cd into the directory and open vscode
1. In the terminal, run `npm i` to install dependencies.
1. Copy `.env-example` as `.env`
1. Run `heroku create`
1. Run `npm run setup-heroku` to create:
    1. A production heroku SQL database in the cloud to go with your heroku app
    1. A second dev heroku SQL database in the cloud to use when doing local development
    1. It returns the `DEV_DATABASE_URL`
1. Copy the `DEV_DATABASE_URL` from previous step, or run `npm run get-dev-db-url` to refetch the url

### ACP and Branch

1. ACP your main branch
1. Work on a new branch: `git checkout -b dev` (or `feature-name` or `day-02`, etc.)

### Create data models

There are `package.json` script for running parts or all of your db setup:

1. `npm run create-tables` - create SQL tables
1. `npm run drop-tables` - drop SQL tables
1. `npm run recreate-tables` - drop and create SQL tables
1. `npm run load-seed-data` - load seed data
1. `npm run setup-db` - recreate tables and load seed data

Use these scripts while developing your db model. Inspect progress using PGAdmin Tool. Remember, it 
should be okay to re-run whole process. The purpose of `setup-db` is to restore your db to a know "setup" state.

Change all the files in the `data` directory to match the data model of your app:
1. `/data/create-tables.js` - SQL to create needed tables
1. `/data/drop-tables.js` - SQL to drop all tables
1. Seed data file - data to load into the db as starter or "seed" data
1. `/data/load-seed-data.js` - SQL to insert each item from the seed data array

## Running the server

1. Run `npm run start:watch` to start the dev server in watch mode

## E2E Testing and Adding Routes

- `/__tests__/app.test.js` contains testing file for routes. It has before code to run your db setup and after code to close the db connection
- Use `npm run test:watch` to start tests in watch mode
- Routes go in `app.js` (not `server.js`)