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

/**
 * @swagger
 * components:
 *   schemas:
 *     Roles:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: associated user id
 *         event:
 *           type: string
 *           description: associated event id
 *         role:
 *           type: string
 *           description: role of the user in the event
 *       example:
 *         user: "647e48221e1b7b3f89c138cc"
 *         event: "647e48261e1b7b3f89c138e9"
 *         role: "Organizador"
 */
