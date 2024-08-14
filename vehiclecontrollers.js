const axios = require('axios');
const Vehicle = require('../models/vehicle');
const Org = require('../models/org');

// Rate limiting logic placeholder
const requestLimit = new Map(); // Store request timestamps

const rateLimitedRequest = async (url, vin) => {
    const now = Date.now();
    const timestamps = requestLimit.get(vin) || [];

    // Clean up old timestamps
    while (timestamps.length > 0 && now - timestamps[0] > 60 * 1000) {
        timestamps.shift();
    }

    if (timestamps.length >= 5) {
        throw new Error('Rate limit exceeded');
    }

    timestamps.push(now);
    requestLimit.set(vin, timestamps);

    const response = await axios.get(url);
    return response.data;
};

const decodeVIN = async (req, res) => {
    const { vin } = req.params;
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: 'Invalid VIN format' });
    }

    try {
        const data = await rateLimitedRequest(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
        const { Manufacturer, Model, ModelYear } = data.Results[0];
        res.json({
            manufacturer: Manufacturer,
            model: Model,
            year: ModelYear
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addVehicle = async (req, res) => {
    const { vin, org } = req.body;
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: 'Invalid VIN format' });
    }

    try {
        const orgExists = await Org.findById(org);
        if (!orgExists) {
            return res.status(400).json({ error: 'Organization not found' });
        }

        const data = await rateLimitedRequest(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`);
        const { Manufacturer, Model, ModelYear } = data.Results[0];

        const vehicle = new Vehicle({
            vin,
            manufacturer: Manufacturer,
            model: Model,
            year: ModelYear,
            org
        });
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getVehicle = async (req, res) => {
    const { vin } = req.params;
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
        return res.status(400).json({ error: 'Invalid VIN format' });
    }

    try {
        const vehicle = await Vehicle.findOne({ vin });
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json(vehicle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    decodeVIN,
    addVehicle,
    getVehicle
};
