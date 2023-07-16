const Person = require('../models/personsModel');

exports.getPersons = async (req, res) => {
  try {
    const persons = await Person.aggregate([
      // {
      //   $match: { gender: 'female' },
      // },
      // {
      //   $limit: 100,
      // },
      // {
      //   $group: {
      //     _id: { eyeColor: '$eyeColor', favoriteFruit: '$favoriteFruit' },
      //   },
      // },
      // {
      //   $sort: { age: -1 },
      // },
      // {
      //   $count: 'peoplesCount',
      // },
      // {
      //   $project: {
      //     _id: 0,
      //     name: 1,
      //     info: {
      //       eyes: '$eyeColor',
      //       fruit: '$favoriteFruit',
      //       country: '$company.location.country',
      //     },
      //   },
      // },
      // {
      //   $unwind: '$tags',
      // },
      // {
      //   $project: {
      //     name: 1,
      //     eyeColorType: { $type: '$eyeColor' },
      //     ageType: { $type: '$age' },
      //   },
      // },
      {
        $project: { name: 1, gender: 1, age: 1 },
      },
      // { $out: 'eyeColorAndGender' },
    ]);

    res
      .status(200)
      .json({ status: 'success', results: persons.length, data: persons });
  } catch (error) {
    res.status(200).json({ status: 'failed', message: error.message });
  }
};
