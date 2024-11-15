const express = require("express");
const Show = require("../model/Show");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// ------------------------------- ROUTE 1 -------------------------------

// route (/api/show/addShow)

// POST -> add new show

router.post("/addShow", async (req, res) => {
  try {
    const { title, type, description, genre, releaseDate, runtime, image } =
      req.body;
    const show = await Show.create({
      title,
      type,
      description,
      genre,
      releaseDate,
      runtime,
      image,
    });
    res.status(200).json({
      success: true,
      message: "new show added successfully",
      show,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("internal server error :/");
  }
});

// ------------------------------- ROUTE 2 -------------------------------

// route (/api/show/allShows)

// GET -> get all shows

router.get("/allShows", async (_req, res) => {
  try {
    const shows = await Show.find();
    res.status(200).json({
      success: true,
      total: shows.length,
      shows,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("internal server error :/");
  }
});

// ------------------------------- ROUTE 3 -------------------------------

// route (/api/show?id=xxxx)

// GET -> get details of a show

router.get("", async (req, res) => {
  try {
    const showId = req.query.id;
    if (!showId) {
      return res.status(400).json({
        success: false,
        message: "show id is required",
      });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: "show not found",
      });
    }

    res.status(200).json({
      success: true,
      show,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("internal server error :/");
  }
});

// ------------------------------- ROUTE 4 -------------------------------

// route (/api/show/user?=id/shows)

// GET -> get all shows of a user

router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.query.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "user id is required in the query string.",
      });
    }

    const shows = await Show.find({ userId });

    if (!shows || shows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no shows found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      shows,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "internal server error :/",
    });
  }
});

module.exports = router;
