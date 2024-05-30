const express = require("express");
const bodyParser = require("body-parser");
const color = require("colors");
const dotenv = require("dotenv");
const app = express();
dotenv.config({ path: "./config/.env" });
require("./database/connection/mongodb");

const port = process.env.PORT || 9000;
app.use(bodyParser.json());

// -------------- Import and Use Routes -----------------
const userRoutes = require("./src/routes/userRoutes");
const candidateRoute = require("./src/routes/candidateRoute");
const votingRoute = require("./src/routes/votingRoute");

app.use("/user", userRoutes);
app.use("/candidate", candidateRoute);
app.use("/voting", votingRoute);

app.listen(port, () => {
    console.log(`Server Listening On port ${port}`.bgMagenta.black);
});
