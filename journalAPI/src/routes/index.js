const { Router } = require("express");
const router = Router();

//Ante una petición GET regresar una pagina HTML con información de la api.
router.get("/", (req, res) => {
  res.json("Journal IA api");
});

module.exports = router;