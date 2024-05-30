const express = require('express');
const router = express.Router();
const Candidate = require('../../database/models/candidate');
const User = require('../../database/models/user');
const { jwtAuthMiddleware } = require('../controller/jwt');
const checkIsAdmin = require('../controller/adminRole');

router.post('/', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!await checkIsAdmin(req.user.id)) {
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

router.get("/candidates", async (req, res) => {
    try {
        const candidates = await Candidate.find().lean();
        res.status(200).json({ candidates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!await checkIsAdmin(req.user.id)) {
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

router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
        if (!await checkIsAdmin(req.user.id)) {
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

        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();

        res.status(200).json({ message: "Vote successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
