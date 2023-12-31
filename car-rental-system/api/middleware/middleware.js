const jwt = require("jsonwebtoken");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null
    : null;
  if (!token) return res.status(403).json("Unauthorized");
  const decodedUser = jwt.verify(
    token,
    process.env.JWT_SECRET || "jsecret"
  ).data;
  const user = decodedUser
    ? await User.findOne({ user_id: decodedUser.user_id })
    : null;
  if (!user) return res.status(403).json("Unauthorized");
  req.user = user;
  next();
};
//attackers can make authenticated users perform unintended actions without their knowledge.

// CSRF Protection Middleware
//middleware csrfProtection has been added to provide CSRF protection using cookies.

const csrfProtection = csrf({ cookie: true });

module.exports = {
  protect,
  csrfProtection,
  cookieParser,
};
