const express = require('express');
const { createOrg, patchOrg, getOrgs } = require('../controllers/orgcontrollers')

const router = express.Router();

// Route to create an organization
router.post('/', createOrg);

// Route to update an organization
router.patch('/:id', patchOrg);

// Route to get all organizations
router.get('/', getOrgs);

module.exports = router;
