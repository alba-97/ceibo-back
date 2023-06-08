// Swagger Documentation
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: the user name on the site
 *         first_name:
 *           type: string
 *           description: the user real name
 *         last_name:
 *           type: string
 *           description: the user last name
 *         email:
 *           type: string
 *           description: the user email
 *         birthdate:
 *           type: string
 *           description: the user birthdate
 *         phone:
 *           type: string
 *           description: the user phone number
 *         profile_img:
 *           type: string
 *           description: a profile image selected by the user
 *         password:
 *           type: string
 *           description: the user password
 *         address:
 *           type: string
 *           description: user address
 *       required:
 *         - username
 *         - password
 *         - first_name
 *         - last_name
 *         - email
 *       example:
 *          id: 1
 *          username: ester123
 *          firstname: ester
 *          lastname: esterosa
 *          email: ester@ester.com
 *          password: Ester123456
 *          birthdate: 2023-06-05
 *          address: peronia 456
 *
 */

//signup a user
/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: signup user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: user signed up successfully
 */
// get all users
/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: return all signed up users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: signed up users found
 *         content:
 *           application/json:
 *             schema:
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// get one user
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: return a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: true
 *           description: the user id
 *     responses:
 *       200:
 *         description: user found correctly
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: user not found
 */
//Login user
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: ester123
 *               password:
 *                 type: string
 *                 example: Ester123456
 *     responses:
 *       200:
 *         description: User login succesfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       404:
 *         description: an error as occurred
 */

// Logout user
/**
 * @swagger
 * /api/users/logout:
 *   get:
 *     summary: Cerrar sesión del usuario
 *     tags: [User]
 *     responses:
 *       204:
 *         description: Sesión cerrada exitosamente
 */
// update one user
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: update a user info
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           required: false
 *           description: the user id (optional)
 *     requestBody:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: user updated correctly
 *       404:
 *         description: user not found
 */
