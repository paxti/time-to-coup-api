import {} from 'dotenv/config';
import app from './app';

// eslint-disable-next-line no-console
app.listen(process.env.PORT, () =>
  console.log(`Server is listening on port ${process.env.PORT}`)
);
module.exports = app;
