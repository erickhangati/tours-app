const express = require('express');
const personsController = require('../controllers/personsController');

const router = express.Router();

router.route('/').get(personsController.getPersons);

module.exports = router;
