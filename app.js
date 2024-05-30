const express = require("express");
const app = express();
require("dotenv").config({path: "./config/.env"});
const port = process.env.PORT || 9000;

app.get("/", (req,res)=>{
   res.send("hello i am voting app");
});

app.listen(port, ()=>{
     console.log(`Server Listening On port ${port}`);
})