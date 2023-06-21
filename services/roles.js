const { Role } = require("../models");

exports.createNewRole = async (userId, eventId, role, rating) => {
  try {
    let roleData = {
      user: userId,
      event: eventId,
      role,
    };
    if (rating) roleData.rating = rating;

    const newRole = await new Role(roleData).save();
    await newRole.save();
    return newRole;
  } catch (error) {
    throw error;
  }
};

exports.rateEvent = async (userId, eventId, rating) => {
  try {
    const role = await Role.findOne({ user: userId, event: eventId });
    if (role && role.role != "Organizador") {
      await Role.updateOne({ _id: role._id }, { rating });
    }
  } catch (error) {
    throw error;
  }
};

exports.userRating = async (eventId, userId) => {
  try {
    const role = await Role.findOne({ user: userId, event: eventId });
    return role.rating;
  } catch (error) {
    throw error;
  }
};

exports.removeRoleByEventId = async (userId, eventId) => {
  try {
    const role = await Role.findOne({ user: userId, event: eventId });
    if (!role) {
      throw new Error("El rol no existe");
    }
    await Role.findByIdAndRemove(role._id);
  } catch (error) {
    throw error;
  }
};
