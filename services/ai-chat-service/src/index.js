require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok", service: "ai-chat-service" }));

// TODO: build out real routes here. See README.md "Build order" for what
// this service is responsible for.
app.get("/", (req, res) => {
  res.json({ message: "ai-chat-service is running but has no real routes yet." });
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => console.log(`ai-chat-service listening on port ${PORT}`));
