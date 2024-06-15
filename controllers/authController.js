const Notes = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

//POST AUTENTICATE THE USER WHO TRY LO LOGIN
const autenticationUser = asyncHandler(async (req, res) => {
    const { usernameBody, passwordBody } = req.body;

    if (!usernameBody || !passwordBody) {
        return res.status(400).json({ message: "all fields are required." });
    }

    const user = await User.findOne({ username: usernameBody }).lean().exec();

    if (!user) {
        return res.status(400).json({ message: "nessun utente trovato." });
    }

    if (!user.active) {
        return res.status(401).json({ message: " Unauthorized. Utente non attivo." });
    }

    const IsPswMatching = await bcrypt.compare(passwordBody, user.password);

    if (!IsPswMatching) {
        return res.status(401).json({ message: "password non corretta.Unauthorized." });
    }

    // stringa per criptare il token (firma)
    // const secretKey = process.env.ACCESS_TOKEN_SECRET;

    // token di accesso inviato al client
    const accessToken = jwt.sign(
        {
            UserInfo: {
                userId: user._id,
                username: user.username,
                roles: user.roles,
                active: user.active,
            },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
    );

    // token per il refresh inviato al client
    const refreshToken = jwt.sign({ username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    // creare un cookie di sicurezza con il refresh token
    // creare un cookie per mantenere la sessione dell'utente aperta. il token di refresh viene memorizzato in un cookie sicuro.
    // Se il token di accesso scade, il client invia il cookie contenente il token di refresh al server per ottenere un nuovo token di accesso.

    // INVIO AL CLIENT IL COOKIE CONTENENTE IL REFRESH TOKEN
    res.cookie("jwt", refreshToken, {
        httpOnly: true, // Questa opzione impedisce l'accesso al cookie tramite JavaScript nel browser del client. Questo aiuta a prevenire attacchi cross-site scripting (XSS) in cui un attaccante potrebbe cercare di rubare il cookie.
        secure: true, //Questa opzione indica che il cookie dovrebbe essere inviato solo su connessioni sicure HTTPS. Se impostato su true, il cookie non verrà inviato se la connessione è HTTP.
        sameSite: "none", //Questa opzione controlla quando i cookie sono inviati con le richieste cross-site. Impostando sameSite su "none", il cookie verrà inviato in tutte le richieste cross-origin, ma solo se secure è true. Questo è utile per garantire che il cookie sia inviato anche in contesti cross-origin, come le richieste API da domini diversi, ma richiede che la connessione sia sicura.
        maxAge: 7 * 24 * 60 * 60 * 1000, //Questa opzione imposta la durata del cookie in millisecondi. In questo caso, il cookie è impostato per scadere dopo 7 giorni. maxAge è calcolato come 7 giorni * 24 ore * 60 minuti * 60 secondi * 1000 millisecondi.
    });

    // res.cookie("jwt", refreshToken, {
    //     httpOnly: true,
    //     secure: false, // Modificato per testare in locale senza HTTPS
    //     sameSite: "lax", // Modificato per compatibilità con connessioni non-HTTPS in locale
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    // INVIO AL CLIENT UN JSON CON IL TOKEN DI ACCESSO
    res.json({ accessToken });
});

// action che servirà per rinnovare il token dell utente.
const refresh = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt)
        return res.status(401).json({ message: "Unauthorized. non stai fornendo il cookie per il refresh ? " });

    const refreshToken = cookies.jwt;
    // const refreshKey = process.env.REFRESH_TOKEN;
    // const secretKey = process.env.ACCESS_TOKEN;

    // const refreshToken = cookies.jwt;

    // alla richiesta di refresh del token di accesso verifico il cookies , se contiene le informaziooi corrette , info sullo username ecc.., creo un nuovo token di accesso da inviare al client.
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err)
                return res
                    .status(403)
                    .json({ message: "Forbidden. non sei autorizzato ad accedere. Token scaduto ? " });

            const foundUser = await User.findOne({ username: decoded.username });

            if (!foundUser) {
                return res.status(401).json({ message: "Unauthorize. User non trovato." });
            }

            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        userId: foundUser._id,
                        username: foundUser.username,
                        roles: foundUser.roles,
                        active: foundUser.active,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10m" }
            );

            return res.json({ accessToken });
        })
    );
};

// logica da applicare al momento del logout dell'utente.
const logout = (req, res) => {
    const cookies = req.cookies;

    // se al momento del logout non viene inviato un cookie
    if (!cookies?.jwt) return res.sendStatus(204); // no content

    // se invece al momento del logout viene fornito un body con un cookie , cancello il cookies ( cleaning del cookies)

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    return res.status(200).json({ message: "Cookie Cleared." });
};

module.exports = {
    autenticationUser,
    refresh,
    logout,
};
