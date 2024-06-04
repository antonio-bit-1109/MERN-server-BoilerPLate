const express = require("express");
const router = express.Router();
const path = require("path");

//  configura una rotta che risponde alle richieste GET all'URL radice (/), /index, e /index.html, inviando il file index.html come risposta.
router.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
