const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.status(200).json({
    message: "Room Route",
  });
});

router.get("/health", (req, res) => {
  return res.status(200).json({
    message: "Room healthy",
  });
});

module.exports = router;
