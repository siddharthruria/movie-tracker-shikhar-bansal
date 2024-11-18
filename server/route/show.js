const express = require("express");
const Show = require("../model/Show");
const verifyToken = require("../middleware/verifyToken");
const User = require("../model/User");

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

  // route (/api/show/user?=id)

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

      const user = await User.findById(userId).populate("list.id");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found.",
        });
      }

      const shows = user.list.map((item) => item.id);

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

// ------------------------------- ROUTE 5 -------------------------------

// route (/api/show/user/12345/list/shows/to-watch)

// GET -> get all shows of category (to watch/watched) of a user

router.get(
  "/user/:userId/list/shows/:status",
  verifyToken,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { status } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "user ID is required in the query string.",
        });
      }

      if (!["to-watch", "watched"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "invalid status. must be 'to-watch' or 'watched'.",
        });
      }

      const user = await User.findById(userId).populate("list.id");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "user not found.",
        });
      }

      const filteredShows = user.list.filter((item) => item.status === status);

      if (filteredShows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `no ${status} shows found for this user.`,
        });
      }

      res.status(200).json({
        success: true,
        shows: filteredShows,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({
        success: false,
        error: "internal server error :/",
      });
    }
  }
);

// ------------------------------- ROUTE 6 -------------------------------

// route (/api/show/user/add)

// POST -> add a show to user (to-watch/watched) list

router.post("/user/add", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { showId, status } = req.body;

    if (!["to-watch", "watched"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "invalid status. must be 'to-watch' or 'watched'.",
      });
    }

    if (!showId) {
      return res.status(400).json({
        success: false,
        message: "show id is required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const existingEntry = user.list.find(
      (item) => item.id.toString() === showId
    );

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: "this show is already in your list.",
      });
    }

    user.list.push({ id: showId, status });

    await user.save();

    res.status(200).json({
      success: true,
      message: `show added to your ${status} list successfully.`,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: "internal server error :/",
    });
  }
});

// ------------------------------- ROUTE 6 -------------------------------

// route (/api/show/search)

// GET -> search query

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "search query is required.",
      });
    }

    const shows = await Show.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({
      success: true,
      total: shows.length,
      shows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "internal server error :/",
    });
  }
});

module.exports = router;
