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
    console.log(error);
  }
};

exports.removeRoleByEventId = async (userId, eventId) => {
  try {
    const role = await Role.findOne({ user: userId, event: eventId });
    if (!role) {
      throw new Error("El rol no existe");
    }
    await Role.findByIdAndRemove(role._id);
    console.log("Rol eliminado correctamente");
  } catch (error) {
    console.log("Error al eliminar el rol", error);
  }
};
