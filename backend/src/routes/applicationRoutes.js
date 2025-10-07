const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const appCtrl = require('../controllers/applicationController');

// Freelancer applies to a gig
router.post('/:gigId/apply', authMiddleware, appCtrl.applyToGig);

// Client gets applications for a gig
router.get('/gig/:gigId', authMiddleware, appCtrl.getApplicationsForGig);

// Freelancer gets own applications
router.get('/me', authMiddleware, appCtrl.getMyApplications);

// Client updates application status
router.patch('/:id/status', authMiddleware, appCtrl.updateApplicationStatus);

module.exports = router;
