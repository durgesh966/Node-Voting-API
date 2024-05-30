const express = require('express');
const router = express.Router();
const User = require('../../database/models/user');
const { jwtAuthMiddleware, generateToken } = require('../controller/jwt');

// POST route to add a person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newPerson = new User(data);
        const response = await newPerson.save();
        console.log('data saved');

        const payload = {
            id: response.id,
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is : ", token);

        res.status(200).json({ response: response, token: token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Login Route
router.post('/login', async (req, res) => {
    try {
        // Extract adharCardNumber and password from request body
        const { adharCardNumber, password } = req.body;

        // Find the user by adharCardNumber
        const user = await User.findOne({ adharCardNumber: adharCardNumber });

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid adhar Number or password' });
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({ token })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user;
        console.log("User Data: ", userData);

        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET method to get the person
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user; // Extract the id from the URL parameter
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        // If password does not match, return error
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid adhar Number or password' });
        }
        user.password = newPassword;
        await user.save();

        console.log('password updated successfully');
        res.status(200).json({ message: "password updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;