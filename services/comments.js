const { Comment } = require("../models");

exports.addComment = async (event, data) => {
  try {
    const comment = new Comment(data);
    await comment.populate({
      path: "user",
      model: "User",
      select: "-password -salt",
    });
    await comment.save();
    event.comments.push(comment);
    await event.save();
    return comment;
  } catch (error) {
    throw error;
  }
};
