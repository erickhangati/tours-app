const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.ldtv9dk.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Database connected successfully'))
  .catch((error) =>
    console.log(
      `Database did not connect successfully. Error: ${error.message}`
    )
  );

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App listening to port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`${err.name} - ${err.message}`);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`${err.name} - ${err.message}`);
  server.close(() => process.exit(1));
});
