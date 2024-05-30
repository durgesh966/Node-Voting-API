const express = require('express');
const router = express.Router();
const Candidate = require('../../database/models/candidate');
const { jwtAuthMiddleware } = require('../controller/jwt');
const checkIsAdmin = require('../controller/adminRole'); // Corrected function name

// POST route to add a candidate
router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (! await checkIsAdmin(req.user.id)) {
            return res.status(403).json({ message: "Only admins can do this" });
        }
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();
        console.log('Data saved');
        res.status(200).json({ response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT route to update a candidate
router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (! await checkIsAdmin(req.user)) {
            return res.status(403).json({ message: "Only admins can do this" });
        }

        const candidateId = req.params.candidateID;
        const updateCandidateData = req.body;
        const response = await Candidate.findByIdAndUpdate(candidateId, updateCandidateData, {
            new: true,
            runValidators: true
        });

        if (!response) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate update successful");
        res.status(200).json({ response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE route to delete a candidate
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (! await checkIsAdmin(req.user)) {
            return res.status(403).json({ message: "Only admins can do this" });
        }

        const candidateId = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        console.log("Candidate delete successful");
        res.status(200).json({ response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ------------------ lets start voting -----------------
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
  
});

module.exports = router; 
