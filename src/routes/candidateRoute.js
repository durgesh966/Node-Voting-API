const express = require('express');
const router = express.Router();
const Candidate = require('../../database/models/candidate');
const { jwtAuthMiddleware } = require('../controller/jwt');
const checkIsAdmin = require('../controller/adminRole'); // Corrected function name
const User = require('../../database/models/user');

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
    candidateID = req.params.candidateID;
    userId = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        if (user.isVoted) {
            res.status(400).json({ message: "you have alredy voted" });
        }
        if (user.role == "admin") {
            res.status(403).json({ message: "admin is not allowed for vote" });
        }

        // ---- update candidate ----
        Candidate.votes.push({ user: userId });
        Candidate.voteCount++;
        await Candidate.save();

        User.isVoted = true;
        await user.save();
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router; 
