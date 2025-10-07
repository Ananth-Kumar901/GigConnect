const Application = require('../models/Application');
const Gig = require('../models/Gig');
const User = require('../models/User');

// ✅ Freelancer applies to a gig
exports.applyToGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { coverLetter, bidAmount } = req.body;
    const freelancerId = req.user.id;

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Check if already applied
    const existing = await Application.findOne({ gig: gigId, freelancer: freelancerId });
    if (existing) return res.status(400).json({ message: 'Already applied for this gig' });

    const application = new Application({
      gig: gigId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
    });

    await application.save();

    const populatedApp = await Application.findById(application._id)
      .populate('freelancer', 'name email')
      .populate('gig', 'title budget');

    res.status(201).json({ message: 'Applied successfully', application: populatedApp });
  } catch (err) {
    console.error('applyToGig error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Client fetches applications for their gig
exports.getApplicationsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;
    if (!gigId || gigId === 'undefined') {
      return res.status(400).json({ message: 'Invalid gig ID' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    // Only allow the client who owns the gig to view applications
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Not your gig' });
    }

    const applications = await Application.find({ gig: gigId })
      .populate('freelancer', 'name email')
      .populate('gig', 'title budget');

    res.status(200).json(applications);
  } catch (err) {
    console.error('getApplicationsForGig error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Freelancer views their applications
exports.getMyApplications = async (req, res) => {
  try {
    const freelancerId = req.user.id;
    const applications = await Application.find({ freelancer: freelancerId })
      .populate('gig', 'title budget status');
    res.status(200).json(applications);
  } catch (err) {
    console.error('getMyApplications error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Client updates application status (accept/reject)
// ✅ Client updates application status (accept/reject)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params; // ✅ match the route param
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findById(id)
      .populate('gig')
      .populate('freelancer');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Only gig owner can update
    if (application.gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Not your gig' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ message: 'Status updated successfully', application });
  } catch (err) {
    console.error('updateApplicationStatus error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
