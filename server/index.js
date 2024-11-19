require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("not allowed by cors"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

connectDB();

const userRoute = require("./route/user");
const showRoute = require("./route/show");

app.use("/api/user", userRoute);
app.use("/api/show", showRoute);

const PORT = process.env.PORT;

app.get("/", (_req, res) => {
  res.send("welcome to the movie-tracker application express server home");
});

app.listen(PORT, () => {
  console.log(`server listening to requests on port ${PORT}`);
});
