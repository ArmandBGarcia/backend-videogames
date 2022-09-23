const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const videogames = require("./videogame.routes.js");
const genres = require("./genres.routes.js");

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/videogames", videogames);
router.use("/genres", genres);

module.exports = router;
