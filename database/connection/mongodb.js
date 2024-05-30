const mongoose = require('mongoose');
const color = require("colors");
const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB server'.bgGreen.black);
});

db.on('error', (err) => {
    console.error(`MongoDB connection error:, ${err}`.bgRed.black);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected'.bgYellow.black);
});

module.exports = db;

