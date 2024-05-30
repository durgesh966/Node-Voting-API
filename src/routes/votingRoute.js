const express = require('express');
const router = express.Router();
const Candidate = require('../../database/models/candidate');
const { jwtAuthMiddleware } = require('../controller/jwt');
const checkIsAdmin = require('../controller/adminRole'); // Corrected function name
const User = require('../../database/models/user');

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
