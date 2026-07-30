const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findByEmail, createUser } = require("../models/user.model");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "2h";

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser(email, passwordHash);

    return res.status(201).json({
      message: "Account created successfully.",
      user: { id: user.id, email: user.email, createdAt: user.created_at },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Something went wrong during signup." });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findByEmail(email);
    if (!user) {
      // Same error for "no user" and "wrong password" — don't leak which one.
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    return res.json({ token, expiresIn: TOKEN_EXPIRY });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Something went wrong during login." });
  }
}

module.exports = { signup, login };
