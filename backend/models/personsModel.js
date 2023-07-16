const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Company location sub-schema
const LocationSchema = new Schema({
  country: String,
  address: String,
});

// Define the Company sub-schema
const CompanySchema = new Schema({
  title: String,
  email: String,
  phone: String,
  location: LocationSchema,
});

// Define the main schema
const PersonSchema = new Schema({
  index: Number,
  name: String,
  isActive: Boolean,
  registered: Date,
  age: Number,
  gender: String,
  eyeColor: String,
  favoriteFruit: String,
  company: CompanySchema,
  tags: [String],
});

// Create the model
const Person = mongoose.model('Person', PersonSchema);

module.exports = Person;
