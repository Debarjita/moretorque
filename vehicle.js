const express = require('express');
const { decodeVIN, addVehicle, getVehicle } = require('../../src/controllers/vehiclecontrollers');

const router = express.Router();

// Route to decode VIN
router.get('/decode/:vin', decodeVIN);

// Route to add a vehicle
router.post('/', addVehicle);

// Route to get vehicle details by VIN
router.get('/:vin', getVehicle);

module.exports = router;
