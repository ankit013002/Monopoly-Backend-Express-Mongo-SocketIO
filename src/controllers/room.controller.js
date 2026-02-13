const { gameIds } = require("../utils/gameIds");

const createGame = (req, res) => {
  const { numberOfPlayers } = req.body;

  if (
    !numberOfPlayers ||
    typeof numberOfPlayers !== "number" ||
    numberOfPlayers <= 0
  ) {
    return res.status(400).json({
      message: "Valid player count not provided",
    });
  }

  const gameId = Math.floor(Math.random() * 1000);

  gameIds.push(gameId);

  console.log(`GAME IDS: ${gameIds}`);

  return res.status(200).json({
    message: `Room Created for ${numberOfPlayers} players`,
    gameId,
  });
};

const joinGame = (req, res) => {
  const { gameId } = req.body;

  console.log(`GAME IDS: ${gameIds}`);

  res.status(200).json({
    message: `Successfully joined Game with ID: ${gameId}`,
  });
};

module.exports = { createGame, joinGame };
