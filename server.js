// inizializzare il server in express
const express = require("express");
const app = express();

// aggiungere il metodo per inizializzare le route sul server
const path = require("path");

//importo il logger.js
const { logger } = require("./middlewere/logger");

// porta di ascolto del server, alla quale collegarci per accedere al server in locale.
const PORT = process.env.PORT || 3500;

// _____________________________________ inizio dei middlewere _________________________________________________

app.use(logger);
//MIDDLEWERE per abilitare il server alla ricezione e invio di json.
app.use(express.json());

//MIDDLEWERE -- DIRE AL SERVER DOVE PRENDERE FILE STATICI.
// percorso dal quale andare a prendere file statici (immagini, foto , svg ecc..) un po come per la cartella public inr eact, non c'è bisogno di specificare nel percorso anche public.
app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));

// se la rotta della richiesta dal client non viene trovata, il server ritorna una risposta di 404 in uno dei 3 formati descritti
//(.json , .txt , .html)
app.all("*", (req, res) => {
    res.status(404);

    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ message: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
