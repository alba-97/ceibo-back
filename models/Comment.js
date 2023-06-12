const mongoose = require("mongoose");
const { Schema } = mongoose;

const CommentSchema = new Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Comment", CommentSchema);
