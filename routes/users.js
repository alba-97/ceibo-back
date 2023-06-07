const express = require("express");
const {
  updateUser,
  getUsers,
  getUser,
  signup,
  logout,
  secret,
  login,
  me,
} = require("../controllers/users");
const validateUser = require("../middleware/auth");

const router = express.Router();

router.get("/", getUsers);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/secret", secret);
router.get("/me", validateUser, me);

router.get("/:id", getUser);

router.put("/", validateUser, updateUser);

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
// Login one user
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de usuario
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
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: El usuario ha iniciado sesión exitosamente
 *       400:
 *         description: Ha ocurrido un error
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
 *           required: true
 *           description: the user id
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
module.exports = router;
