// tankRoutes.js
const express = require('express');
const {getTanksByLocation, getAllLocations,getTanksByIds } = require('../controllers/tankController'); 

const router = express.Router();

router.get('/location', getAllLocations);
router.get('/tanksname', getTanksByLocation); // Needs locationId as query param
router.get('/tankinfo', getTanksByIds); // Needs ids as query param (comma-separated)



module.exports = router;
