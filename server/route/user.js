const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../model/User");
const bcrypt = require("bcrypt");
const Token = require("../model/Token");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------------------- ROUTE 1 -------------------------------

// route (/api/user/createUser)

// POST -> create new user

router.post(
  "/createUser",
  // middleware. creates request body validations according to the mentioned checks
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password must be 5 characters long atleast").isLength({
      min: 5,
    }),
  ],

  async (req, res) => {
    // validates request body against the checks
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array(),
      });
    }

    // check whether the email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "email already exists",
      });
    }

    // hashing the password before storing
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const securePass = await bcrypt.hash(req.body.password, salt);

    // create a new user and store it
    try {
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });

      // proceed to send the payload since username/email and password are correct
      const payload = {
        user: {
          id: user._id,
          email: user._email,
        },
      };

      // create a jwt auth signing it with the payload and return it
      const token = jwt.sign(payload, JWT_SECRET);
      const newToken = new Token({ token, user: user._id });
      await newToken.save();

      res.cookie("token", token, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 4 * 24 * 60 * 60 * 1000, // persist for 4 days
        // sameSite: "Strict",
      });
      res.status(200).json({
        success: true,
        newToken,
        message: "user created successfully",
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("internal server error :/");
    }
  }
);

// ------------------------------- ROUTE 2 -------------------------------

// route (/api/user/authenticate)

// POST -> authenticate user

router.post(
  "/authenticate",
  [
    body("email", "please provide an email").exists(),
    body("password", "password cannot be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });

      // check whether the entered email is correct
      if (!user) {
        return res.status(400).json({
          success: false,
          error: "invalid email",
        });
      }

      // check whether the entered password is correct
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success: false,
          error: "incorrect password",
        });
      }

      const payload = {
        user: {
          id: user._id,
          email: user._email,
        },
      };

      const token = jwt.sign(payload, JWT_SECRET);
      let existingToken = await Token.findOne({ user: user._id });

      if (existingToken) {
        // if a token already exists, update the existing token
        existingToken.token = token;
        await existingToken.save();
      } else {
        // if no token exists, create a new one
        const newToken = new Token({ token, user: user._id });
        await newToken.save();
      }

      res.cookie("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 4 * 24 * 60 * 60 * 1000,
        // sameSite: "Strict",
      });
      res.status(200).json({
        success: true,
        token,
        message: "authentication successful",
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("internal server error :/");
    }
  }
);

// ------------------------------- ROUTE 3 -------------------------------

// route (/api/user/getUser)

// GET -> get logged user details

router.get(
  "/getUser",

  // middleware for verifying the token
  verifyToken,
  async (req, res) => {
    try {
      // req.user populated with the payload info. by the middleware
      const userId = req.user.id;

      // excluding password from the response
      const user = await User.findById(userId).select("-password");

      // user not found
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "user not found",
        });
      }

      // user authenticated successfully and proceed to send data
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "internal server error :/",
      });
    }
  }
);

module.exports = router;
