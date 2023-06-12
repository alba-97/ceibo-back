const { Role } = require("../models");

exports.createNewRole = async (userId, eventId, role) => {
  try {
    let newRole = await new Role({
      user: userId,
      event: eventId,
      role: role,
    }).save();
    await newRole.save();
    return newRole;
  } catch (error) {
    throw error;
  }
};
