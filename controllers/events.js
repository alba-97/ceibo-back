const asyncHandler = require("express-async-handler");
const {
  createNewEvent,
  findEventById,
  getAllEvents,
  getUserEvents,
  removeEvent,
  updateEventData,
} = require("../services/events");
const { createNewRole } = require("../services/roles");
const { getUsers } = require("../services/users");

exports.createNewEvent = asyncHandler(async (req, res) => {
  try {
    const event = await createNewEvent(req.body);

    const users = await getUsers();
    await createNewRole(users[0]._id, event._id, "Organizador");

    res.status(201).send(event);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.addUserEvent = asyncHandler(async (req, res) => {
  try {
    await createNewRole(req.user._id, req.body.eventId, "Participante");
    res.sendStatus(200);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getEvent = asyncHandler(async (req, res) => {
  try {
    const event = await findEventById(req.params.id);
    res.status(200).send(event);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getAllEvents = asyncHandler(async (req, res) => {
  try {
    const events = await getAllEvents();
    res.status(200).send(events);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getUserEvents = asyncHandler(async (req, res) => {
  try {
    const events = await getUserEvents(req.user._id);
    res.status(200).send(events);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  try {
    await removeEvent(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.updateEventData = asyncHandler(async (req, res) => {
  try {
    await updateEventData(req.params.id, req.body);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
  }
});
