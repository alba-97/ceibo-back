const Role = require("../models/Role");

exports.createNewRole = async (userId, role, eventId) => {
  try {
    let newRole = await new Role({ role: role }).save();
    await newRole.set("user", userId);
    await newRole.set("event", eventId);

    await newRole.populate([
      {
        path: "user",
        select: "username",
        model: "User",
      },
      {
        path: "event",
        select: "title",
        model: "Events",
      },
    ]);
    await newRole.save();

    return newRole;
  } catch (error) {
    console.log(error);
  }
};
