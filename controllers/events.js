const asyncHandler = require("express-async-handler");
const {
  createNewEvent,
  findEventById,
  getAllEvents,
  getFilteredEvents,
  getUserEvents,
  removeEvent,
  updateEventData,
  getOrganizer,
} = require("../services/events");

const {
  createNewRole,
  removeRoleByEventId,
  rateEvent,
} = require("../services/roles");
const { getUserById } = require("../services/users");

exports.createNewEvent = asyncHandler(async (req, res) => {
  try {
    let event;
    // Verificar si se están ejecutando pruebas de Swagger
    const isSwaggerTest = process.env.NODE_ENV === "swagger-test";
    if (isSwaggerTest) {
      event = req.body;
    } else {
      event = await createNewEvent(req.body);
      await createNewRole(req.user._id, event._id, "Organizador");
    }
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

exports.removeUserEvent = asyncHandler(async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    await removeRoleByEventId(userId, eventId);

    res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    console.log("Error al eliminar el evento", error);
    res.status(500).send("Error al eliminar el evento");
  }
});

exports.addUserEvent = asyncHandler(async (req, res) => {
  try {
    await createNewRole(req.user._id, req.body.eventId, "Participante");
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({ message: error });
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
    res.status(400).send({ message: error });
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
    res.status(400).send({ message: error });
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
    res.status(400).send({ message: error });
  }
});

exports.getFilteredEvents = asyncHandler(async (req, res) => {
  try {
    const user = await getUserById(req.user._id);
    const events = await getFilteredEvents(user.preferences);
    res.status(200).send(events);
  } catch (error) {
    res.status(400).send({ message: error });
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
    res.status(400).send({ message: error });
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
    res.status(400).send({ message: error });
  }
});

exports.getOrganizer = asyncHandler(async (req, res) => {
  try {
    const organizer = await getOrganizer(req.params.id);
    res.send(organizer);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});

exports.rateEvent = asyncHandler(async (req, res) => {
  try {
    await rateEvent(req.user._id, req.params.id, req.body.rating);
    res.send({ message: "Se calificó el evento" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});
