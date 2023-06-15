const { validateToken } = require("../config/tokens");
function validateUser(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (token) {
      const { payload } = validateToken(token);
      req.user = payload;
      if (payload) return next();
    }
    res.status(401).send("Usuario no autorizado");
  } catch (error) {
    res.status(401).send("Fallo de validación");
  }
}
module.exports = validateUser;
