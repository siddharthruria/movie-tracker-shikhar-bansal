require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

const PORT = process.env.PORT;

app.get("/", (_req, res) => {
  res.send("welcome to the application server");
});

app.listen(PORT, () => {
  console.log(`server listening to requests on port ${PORT}`);
});
