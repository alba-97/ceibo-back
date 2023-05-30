const asyncHandler = require("express-async-handler");
const Events = require("../models/Events");

exports.createNewEvent = asyncHandler(async (req, res) => {
  try {
    const event = await new Events(req.body).save();
    res.status(201).send(event);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getEvent = asyncHandler(async (req, res) => {
  try {
    const event = await Events.findById(req.params);
    res.status(200).send(event);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getAllEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Events.find();
    res.status(200).send(events);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  try {
    await Events.findByIdAndRemove(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.updateEventData = asyncHandler(async (req, res) => {
  try {
    await Events.findByIdAndUpdate(req.params.id, req.body);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
  }
});
