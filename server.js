import dotenv from 'dotenv';
import app from './lib/app.js';
dotenv.config();

// either use the env variable PORT, or default to 8001
const port = process.env.PORT || 8001;

// time to start the server!
app.listen(port, () => {
  // log a message when all is well...
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});