const { gameIds } = require("../utils/gameIds");

function doesGameExist(req, res, next) {
  const { gameId } = req.body;

  console.log(gameId);
  console.log(gameIds);

  if (!gameIds.find((id) => id === parseInt(gameId))) {
    console.log("here");
    return res.status(400).json({
      message: `Game with id ${gameId} does not exist`,
    });
  }

  next();
}

module.exports = { doesGameExist };
