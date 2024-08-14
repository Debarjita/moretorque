const Org = require('../models/org');

//take data from server and create new data in database.
const createOrg = async (req, res) => {
    const { name, account, website, fuelReimbursementPolicy, speedLimitPolicy } = req.body;

    const org = new Org({
        name,
        account,
        website,
        fuelReimbursementPolicy: fuelReimbursementPolicy || '1000',
        speedLimitPolicy
    });

    try {
        await org.save();
        res.status(201).json(org);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create organization' });
    }
};

//take data from server and update an old data in database.
const patchOrg = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const org = await Org.findById(id);
        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        if (updates.fuelReimbursementPolicy) {
            // Update policy in parent organizations
        }

        if (updates.speedLimitPolicy) {
            // Update policy in children organizations if not overridden
        }

        Object.assign(org, updates);
        await org.save();
        res.status(200).json(org);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update organization' });
    }
};

// returns all the organisation names in data base
const getOrgs = async (req, res) => {
    try {
        const orgs = await Org.find();
        res.status(200).json(orgs);
    } catch (error) {
        res.status(400).json({ error: 'Failed to retrieve organizations' });
    }
};

module.exports = {
    createOrg,
    patchOrg,
    getOrgs
};
