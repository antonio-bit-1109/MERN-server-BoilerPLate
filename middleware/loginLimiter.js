const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 5, // limita il numero massimo di login che è possibile fare uno stesso indirizzo IP
    message: { message: "Too many login attempts from this IP , plese try again after a 60 seconds pause." },
    handler: (req, res, next, options) => {
        logEvents(
            `Too Many Requests : ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin} `,
            "errLog.log"
        );
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = loginLimiter;
