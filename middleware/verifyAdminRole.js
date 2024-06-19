const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// middleware utilizzato per controllare il token inviato dal client per accedere ad una route
const verifyAdminRole = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // se il tken non viene trovato ritorna un errore
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "controlla il Bearer token. Unautorized." });
    }

    // se il token viene trovato viene splittato dalla stringa
    const token = authHeader.split(" ")[1];

    // il token arrivato ( che contiene i dati criptati definiti al momento del login) se corrisponde ai dati definiti nel jwt.verify, consente l'accesso. altrimenti ritorna un errore 403 - Forbidden.

    // IN SOSTANZA SE IL TOKEN PRESENTA AL SUO INTERNO GLI STESSI DATI CRIPTATI DEFINITI AL MOMENTO DLE LOGIN CONSENTE L'ACCESSO ALL'ACTION, ALTRIMENTI TORNA ERRORE,
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden. errore." });

        //   if (!decoded.UserInfo.roles.some((role) => role.toLowerCase() === "admin")) {
        //       return res.status(400).json({ message: "non sei autorizzato." });
        //   }

        console.log(decoded.UserInfo.roles);
        if (!decoded.UserInfo.roles.some((role) => role.toLowerCase() === "admin")) {
            return res.status(400).json({ message: "non sei autorizzato." });
        }

        req.username = decoded.UserInfo.username;
        req.userId = decoded.UserInfo.userId;
        req.roles = decoded.UserInfo.roles;
        req.active = decoded.UserInfo.active;
        next();
    });
});

module.exports = verifyAdminRole;
