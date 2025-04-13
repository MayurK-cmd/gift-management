const jwt = require("jsonwebtoken");

const allowedEmail = "mayurgk2006@gmail.com";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Your JWT secret
    if (decoded.email === allowedEmail) {
      next();
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
