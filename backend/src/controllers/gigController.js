const Gig = require('../models/Gig');

// Create gig (client)
exports.createGig = async (req, res) => {
  try {
    const { title, description, location, budget, skills } = req.body;
    const gig = await Gig.create({
      title,
      description,
      client: req.user._id,
      location: location || '',
      budget: budget || 0,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s=>s.trim()) : [])
    });
    res.status(201).json(gig);
  } catch (err) {
    console.error('createGig error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all gigs (with optional query filters)
exports.getGigs = async (req, res) => {
  try {
    const { skill, location } = req.query;
    const filter = {};
    if (skill) filter.skills = { $in: [skill] };
    if (location) filter.location = new RegExp(location, 'i');
    const gigs = await Gig.find(filter).populate('client', 'name email role');
    res.json(gigs);
  } catch (err) {
    console.error('getGigs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single gig
exports.getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('client', 'name email role');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    console.error('getGig error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update gig (client only)
exports.updateGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });

    const allowed = ['title','description','location','budget','skills','status'];
    allowed.forEach(f => {
      if (req.body[f] !== undefined) {
        gig[f] = f === 'skills' ? (Array.isArray(req.body.skills) ? req.body.skills : req.body.skills.split(',').map(s=>s.trim())) : req.body[f];
      }
    });

    await gig.save();
    res.json(gig);
  } catch (err) {
    console.error('updateGig error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete gig (client only)
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.client.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' });
    await gig.remove();
    res.json({ message: 'Gig deleted' });
  } catch (err) {
    console.error('deleteGig error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
