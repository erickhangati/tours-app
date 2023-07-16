const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const Person = require('../models/personsModel');

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.ldtv9dk.mongodb.net/${process.env.MONGODB_DB}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log(`DB connected successfully`));

const persons = JSON.parse(
  fs.readFileSync(`${__dirname}/persons.json`, 'utf-8')
);

// IMPORT DATA TO DB
const importData = async () => {
  try {
    await Person.create(persons);
    console.log('Data successfully imported');
  } catch (error) {
    console.log(error.message);
  }

  process.exit();
};

// DELETE DATA FROM DB
const deleteData = async () => {
  try {
    await Person.deleteMany();
    console.log('Data successfully deleted');
  } catch (error) {
    console.log(error.message);
  }

  process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();
