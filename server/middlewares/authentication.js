const { verifyToken } = require("../helpers/jwt");
const { Admin } = require("../models");

module.exports = async function authentication(req, res, next) {
  let bearerToken = req.headers.authorization;
  if (!bearerToken) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
  try {
    let acsess_token = bearerToken.split(" ")[1];
    let data = verifyToken(acsess_token);
    let user = await Admin.findByPk(data.id);
    if (!user) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
