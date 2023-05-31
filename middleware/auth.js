const { validateToken } = require("../config/tokens");
function validateUser(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    const { payload } = validateToken(token);
    req.user = payload;
    if (payload) return next();
  }
  res.status(401).send({ message: "Usuario no autorizado" });
}
module.exports = validateUser;
