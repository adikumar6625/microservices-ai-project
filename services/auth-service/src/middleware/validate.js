// Minimal, dependency-free validation. Swap for `zod` or `joi` as the
// project grows and you need more complex rules.
function validateSignup(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email is required." });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters." });
  }
  next();
}

function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  next();
}

module.exports = { validateSignup, validateLogin };
