const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController');
const authMiddleware = require('../middleware/authMiddleware');

// Public: list gigs
router.get('/', gigController.getGigs);

// Public: view one gig
router.get('/:id', gigController.getGig);

// Protected: create/update/delete (client role expected)
router.post('/', authMiddleware, gigController.createGig);
router.patch('/:id', authMiddleware, gigController.updateGig);
router.delete('/:id', authMiddleware, gigController.deleteGig);

module.exports = router;
