// Swagger Documentation
/**
 * @swagger
 * components:
 *   schemas:
 *     Events:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: title of event
 *         descripton:
 *           type: string
 *           description: event description
 *         img:
 *           type: string
 *           description: image related to event
 *         event_date:
 *           type: string
 *           format: date
 *           description: the date of the event
 *         min_age:
 *           type: number
 *           description:  the minimum age to assist at this event
 *         max_age:
 *           type: string
 *           description:  the maximum age to assist at this event
 *         min_to_pay:
 *           type: number
 *           description: the price to assist to an event
 *         total_to_pay:
 *           type: number
 *           description: the final price of the event
 *         deadline_to_pay:
 *           type: date
 *           description: the deadline for pay to assist to an event
 *         link_to_pay:
 *           type: string
 *           description:  the link to pay
 *         category:
 *           type: string
 *           description:  associated category id
 *         start_time:
 *           type: number
 *           description:  the start hour of the event
 *         end_time:
 *           type: number
 *           description:  the end hour of the event
 *       required:
 *         - title
 *         - description
 *         - event_date
 *         - min_to_pay
 *         - total_to_pay
 *         - start_time
 *         - end_time
 *       example:
 *          title: fakeEvent
 *          description: i'm a fake event
 *          event_date: 2023-06-06
 *          min_to_pay: 500
 *          total_to_pay: 2500
 *          start_time: 15:15
 *          end_time: 16:16
 */

//DELETE EVENTS
/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: delete a event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: the event id
 *     responses:
 *       200:
 *         description: event deleted correctly
 *       404:
 *         description: an error has occurred
 */

//CREATE A EVENT
/**
 * @swagger
 * /api/events/:
 *   post:
 *     summary: create a event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Events'
 *     responses:
 *       200:
 *         description: event created successfully
 *       404:
 *         description: an error has occurred
 *
 */

// GET ALL EVENTS
/**
 * @swagger
 * /api/events/:
 *   get:
 *     summary: return all created events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Events found correctly
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/Events'
 *       404:
 *         description: an error has occurred
 */

// GET ONE EVENT
/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: return a specific event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: the event id
 *     responses:
 *       200:
 *         description: event found correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Events'
 *       404:
 *         description: event not found
 */

// UPDATE ONE EVENT
/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: update a event info
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: the event id
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Events'
 *     responses:
 *       200:
 *         description: user updated correctly
 *       404:
 *         description: user not found
 */

//REMOVE USER EVENT
/**
 * @swagger
 * /api/events/stop-participating/{eventId}:
 *   delete:
 *     summary: Delete a user event
 *     tags:
 *       - User Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Exit message
 *                   example: User event deleted successfully
 *       500:
 *         description: an error ocurred erasing the user event
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: an error ocurred erasing the user event
 */

//ADD USER EVENT
/**
 * @swagger
 * /api/events/enroll:
 *   post:
 *     summary: User event added succesfully
 *     tags:
 *       - User Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *                 description: Event id
 *             example:
 *               eventId: 1
 *     responses:
 *       200:
 *         description: User event added successfully
 *       400:
 *         description: an error ocurred
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error Messagge
 */

//GET FILTERED EVENTS
/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Obtiene eventos filtrados según las preferencias del usuario
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: OK. Devuelve una lista de eventos filtrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Error de solicitud. Devuelve el mensaje de error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
