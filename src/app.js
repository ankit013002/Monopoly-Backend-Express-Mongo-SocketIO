const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/room.routes");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Healthy",
  });
});

app.use("/room", roomRoutes);

module.exports = app;
