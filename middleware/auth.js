const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const autenticateMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: " autorizzazione necessaria. Non sei autorizzato." });
    }

    jwt.verify(token, process.env.TOKEN_JWT, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "token fornito non valido." });
        }

        req.user = user;
        next();
    });
});

module.exports = autenticateMiddleware;
