require("dotenv").config();
// inizializzare il server in express
const express = require("express");
const app = express();
// aggiungere il metodo per inizializzare le route sul server
const path = require("path");
//importo il logger.js
const { logger, logEvents } = require("./middlewere/logger");
// importo file per gestione errori
const errorHandler = require("./middlewere/errorHandler");
//importo modulo per poter utilizzare cookie sul server
const cookieParser = require("cookie-parser");
// importo modulo per gestire errore cors. SE SI IMPORTA SOLO CORS API PUBBLICA
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
// importa la connection string al DB di mongodb
const connectDB = require("./config/dbConn");

// importo mongoose (ODM) per mongo DB, oggetto che aiuta nelle configurazioni delle tabelle in mongodb
const mongoose = require("mongoose");

// porta di ascolto del server, alla quale collegarci per accedere al server in locale.
const PORT = process.env.PORT || 3500;

// _____________________________________ inizio dei middlewere _________________________________________________

//utilizzare variabile da .env
// console.log(process.env.MYVAR);
connectDB();

app.use(logger);
app.use(cors(corsOptions));
//MIDDLEWERE per abilitare il server alla ricezione e invio di json.
app.use(express.json());
app.use(cookieParser());
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

app.use(errorHandler);

// funzione che tenta di connettersi una sola volta a mongoDB
mongoose.connection.once("open", () => {
    console.log("connected to MongoDB.");
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
});

// se la connessione al db dovesse fallire verrà creato un file di log con il recap dell errore e fornirà informazioni quali numero errore, status, nome client ecc..
mongoose.connection.on("error", (err) => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
