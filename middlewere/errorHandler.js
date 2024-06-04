const { logEvents } = require("./logger");

// logger per registrare gli errori che si verificano sul server in un file --> logs/errLog.log (cartella logs)
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLog.log");
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500; // server error

    res.status = status;

    res.json({ message: err.message });
};

module.exports = errorHandler;
