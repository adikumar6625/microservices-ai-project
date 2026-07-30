require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "auth-service" }));

app.use("/", authRoutes); // Gateway strips the /auth prefix before forwarding

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Auth Service listening on port ${PORT}`));
