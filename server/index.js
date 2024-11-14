require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // react app's origin
  credentials: true, // enable sending cookies and credentials
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

connectDB();

const userRoute = require("./route/user");

app.use("/api/user", userRoute);

const PORT = process.env.PORT;

app.get("/", (_req, res) => {
  res.send("welcome to the application server");
});

app.listen(PORT, () => {
  console.log(`server listening to requests on port ${PORT}`);
});
