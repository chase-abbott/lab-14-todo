/* eslint-disable no-console */
// `npm i dotenv` reads .env file into process.env
import dotenv from 'dotenv';
dotenv.config();

// `npm i pg` - official postgres node client
import pg from 'pg';
// Use the pg Client
const Client = pg.Client;

// note: you will need to create the database 
// if not part of connection string!
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSLMODE && { rejectUnauthorized: false } // on heroku, ssl required
});

// open the connection to the db
client.connect().then(() => {
  const { database, host, port } = client;
  console.log(`Connected to pg database ${database} on ${host}:${port}`);
});

// then client object is the export
export default client;