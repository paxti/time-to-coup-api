/* eslint-disable no-console */
import {} from 'dotenv/config';
import app from './app';

function logMessage() {
  console.log(`Server is listening on port ${process.env.PORT}`);
}

app.listen(process.env.PORT, () => logMessage());
module.exports = app;
