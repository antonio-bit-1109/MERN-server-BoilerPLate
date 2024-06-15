const allowedOrigins = require("./allowedOrigins");

// in questo file controllo se la richiesta del client arriva da un origine consentita, se lo  è tutto apposto, se non lo è lancio un errore.
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS."));
        }
    },

    credentials: true, // permette invio di cookie
    optionsSuccessStatus: 200,
};

module.exports = corsOptions;
