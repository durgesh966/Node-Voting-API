const express = require('express');
const router = express.Router();
const Candidate = require('../../database/models/candidate');
const { jwtAuthMiddleware } = require('../controller/jwt');
const checkIsAdmin = require('../controller/adminRole');
const User = require('../../database/models/user');

// ------------------ lets start voting -----------------
router.post("/vote/:candidateID", jwtAuthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;
    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: "You have already voted" });
        }
        if (user.role === "admin") {
            return res.status(403).json({ message: "Admin is not allowed to vote" });
        }

        // ---- update candidate ----
        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "Vote registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/vote/count", async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: "desc" });
        const voteRecord = candidates.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            };
        });
        res.status(200).json({ voteRecord });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
