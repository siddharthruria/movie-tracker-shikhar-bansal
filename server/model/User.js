const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (e) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(e);
      },
      message: "invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
  },
  list: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
        required: true,
      },
      status: {
        type: String,
        enum: ["watched", "to-watch"],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
