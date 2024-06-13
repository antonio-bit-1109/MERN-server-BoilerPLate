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

    const IsPswMatching = await bcrypt.compare(passwordBody, user.password);

    if (!IsPswMatching) {
        return res.status(400).json({ message: "password non corretta." });
    }

    const secretKey = process.env.TOKEN_JWT;

    const tokenJwt = jwt.sign(
        { id: user._id, name: user.username, isActive: user.active, roles: user.roles },
        secretKey,
        {
            expiresIn: "7d",
        }
    );

    return res.status(200).json({ token: tokenJwt });
});

module.exports = {
    autenticationUser,
};
