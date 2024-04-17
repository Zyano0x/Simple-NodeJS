const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥');
  console.log(err);

  process.exit(1);
});

const app = require('./app');

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App Running On Port ${port}...`);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB Connection Successful'));

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
