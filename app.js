const express = require("express");
const BodyParser = require("body-parser");
const app = express();
const color = require("colors");

require("dotenv").config({ path: "./config/.env" });
require("./database/connection/mongodb");
const port = process.env.PORT || 9000;

// use middleware 
app.use(BodyParser.json());

// -------------- require routes -----------------
const userRoutes = require("./src/routes/userRoutes");
const candidateRoute = require("./src/routes/candidateRoute")
const votingRoute = require("./src/routes/votingRoute")

app.use("/user", userRoutes);
app.use("/candidate", candidateRoute);
app.use("/voting", votingRoute);

app.listen(port, () => {
     console.log(`Server Listening On port ${port}`.bgMagenta.black);
});