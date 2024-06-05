const user = require("../models/User");
const note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//@desc get all users
//route GET /users
//@access Private
const GetAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users) {
        return res.status(400).json({ message: "No users found." });
    }
    if (users) {
        return res.json(users);
    }
});

//@desc get single user
//route GET /users/:id
//@access Private
const GetSingleUser = asyncHandler(async (req, res) => {
    const SingleUser = await User.findById(req.params.id).select("-password").lean();

    if (!SingleUser) {
        return res.status(400).json({ message: "User not found." });
    }
    if (SingleUser) {
        return res.json(SingleUser);
    }
});

//@desc create new user
//route POST /users
//@access Private
const CreateNewUser = asyncHandler(async (req, res) => {
    // body che mi aspetto di ricevere.
    const { username, password, roles } = req.body;

    // controllo che il body che mi arriva sia coerente con quello che mi serve
    if (!username || !password || !Array.isArray(roles) || roles.length <= 0) {
        return res.status(400).json({ message: "All the fields are required." });
    }

    // controllo che non ci siano altri utenti gia registrati con lo stesso nome
    const duplicateUser = await User.findOne({ username }).lean().exec();

    // se gia esiste un utente con lo stesso nome ritorno un errore
    if (duplicateUser) {
        return res.status(409).json({ message: "Username already in use." });
    }

    //cripto la password se i controlli precedenti vengono superati
    const hashedPassw = bcrypt.hash(password, 10); // criptazione pass sale = 10

    // creo oggetto user che verra salvato nel dbMongo.
    const UserObj = { username, password: hashedPassw, roles };

    // creo nuovo user da salvare sul db
    const user = await User.create(UserObj);

    // se ricevo lo user indietro da mongodb significa che è stato creato con successo
    if (user) {
        return res.status(201).json({ message: `user ${username} created successfully` });
    } else {
        return res.status(400).json({ message: `Invalid data send to the server.` });
    }
});

//@desc edit a user
//route PATCH /users
//@access Private
const EditUser = asyncHandler(async (req, res) => {});

//@desc delete a user
//route DELETE /users
//@access Private
const DeleteUser = asyncHandler(async (req, res) => {});

module.exports = {
    GetAllUsers,
    EditUser,
    CreateNewUser,
    DeleteUser,
    GetSingleUser,
};
