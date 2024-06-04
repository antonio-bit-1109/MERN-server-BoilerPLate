const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// funzione asincrona che registra gli eventi del server in un file di log.
// In sintesi, questo codice definisce una funzione logEvents che registra eventi con un timestamp e un ID univoco in un file di log. Se la cartella logs o il file di log non esistono, li crea.
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), "ddMMyyyy\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
        }
        await fsPromises.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem);
    } catch (err) {
        console.log(err);
    }
};

// questa funzione chiama LogEvents e registra: metodo,url,header che il client sta chiedendo nel file reqLog.log
// "registratore di eventi che accadoo sul server.
// con next() chiama il middlewere successivo."
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = { logEvents, logger };
