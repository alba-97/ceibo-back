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
    let event;
    // Verificar si se están ejecutando pruebas de Swagger
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      event = {
        id: 1,
        title: "fakeEvent",
        description: "i'm a fake event",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      event = await createNewEvent(req.body);

      const users = await getUsers();
      await createNewRole(req.user._id, event._id, "Organizador");
    }

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
    let event;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      event = {
        id: 1,
        title: "fakeEvent",
        description: "I'm a fake event",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      event = await findEventById(req.params.id);
    }
    res.status(200).send(event);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getAllEvents = asyncHandler(async (req, res) => {
  try {
    let events;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      events = {
        id: 1,
        title: "fakeEvent",
        description: "I'm a fake event",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      events = await getAllEvents();
    }
    res.status(200).send(events);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.getUserEvents = asyncHandler(async (req, res) => {
  try {
    let events;
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      events = {
        id: 1,
        title: "fakeEvent",
        description: "I'm a fake event",
        event_date: "2023-06-06",
        min_to_pay: 500,
        total_to_pay: 2500,
        start_time: "15:15",
        end_time: "16:16",
      };
    } else {
      events = await getUserEvents(req.user._id);
    }
    res.status(200).send(events);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      return res.send("Event deleted correctly");
    } else {
      await removeEvent(req.params.id);
    }
    res.sendStatus(204);
  } catch (error) {
    res.send({ message: error });
  }
});

exports.updateEventData = asyncHandler(async (req, res) => {
  try {
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      const updatedEvent = req.body;
      res.status(200).send(updatedEvent);
    } else {
      await updateEventData(req.params.id, req.body);
      res.sendStatus(201);
    }
  } catch (error) {
    console.log(error);
  }
});
