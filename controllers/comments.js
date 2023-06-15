const asyncHandler = require("express-async-handler");
const { addComment, getComments } = require("../services/comments");
const { findEventById } = require("../services/events");

exports.addComment = asyncHandler(async (req, res) => {
  try {
    const data = { user: req.user._id, text: req.body.text };
    const event = await findEventById(req.params.id);
    const newComment = await addComment(event, data);
    res.status(200).send(newComment);
  } catch (error) {
    res.send({ message: error });
  }
});
