const express = require("express");
const { createGame, joinGame } = require("../controllers/room.controller");
const { doesGameExist } = require("../middleware/gameExistence");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Room Route",
  });
});

router.post("/create", createGame);

router.post("/join", doesGameExist, joinGame);

router.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Room healthy",
  });
});

module.exports = router;
