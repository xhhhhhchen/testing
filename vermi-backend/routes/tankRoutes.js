// tankRoutes.js
const express = require('express');
const {getTanksByLocation, getAllLocations  } = require('../controllers/tankController'); 

const router = express.Router();

router.get('/location', getAllLocations);
router.get('/tanksname', getTanksByLocation); // Needs locationId as query param


module.exports = router;
