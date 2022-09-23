const express = require("express");
const { getGenres } = require("./controller");
const server = express();

// server.get("/", (req, res) => {
//   res.json({ msg: "Everything OK" });
// });

server.get("/", async (req, res) => {
  try {
    const genres = await getGenres();
    res.status(202).json(genres);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = server;
