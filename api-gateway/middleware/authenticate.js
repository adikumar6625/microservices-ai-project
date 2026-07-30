const jwt = require("jsonwebtoken");

// Verifies the JWT issued by the Auth Service. On success, attaches the
// decoded payload as req.user and forwards it downstream via a header so
// individual services don't need to re-verify the token themselves.
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed Authorization header." });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.headers["x-user-id"] = decoded.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = authenticate;
