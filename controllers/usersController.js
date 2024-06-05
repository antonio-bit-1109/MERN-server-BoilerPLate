const Notes = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//@desc get all users che sono active
//route GET /users
//@access Private
const GetAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ active: true }).select("-password").lean();

    if (!users || users.length <= 0) {
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
    // const SingleUser = await User.findById(req.params.id).select("-password").lean();
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "you have to gime me ID, BITCH!" });
    }

    const singleUser = await User.findById(id).lean().exec();

    if (!singleUser) {
        return res.status(400).json({ message: "User not found." });
    }
    if (singleUser) {
        return res.json(singleUser);
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
    const hashedPassw = await bcrypt.hash(password, 10); // criptazione pass sale = 10

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
const EditUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body;

    // confirm data
    if (!id || !username || !Array.isArray(roles) || roles.length <= 0 || typeof active !== "boolean") {
        return res.status(400).json({ message: "missing some required data." });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "user not found." });
    }

    // check duplicate
    const duplicate = await User.findOne({ username }).lean().exec();

    // consentire edit solo allo user originale
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: "duplicate username." });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        //hashPasswrd
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();
    res.json({ message: `${updatedUser.username} updated.` });
});

//@desc delete a user
//route DELETE /users
//@access Private
const DeleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "user ID is required to perform this operation." });
    }

    // non cancello user se ha delle note aperte.

    const notes = await Notes.findOne({ referredUser: id }).lean().exec();

    if (notes?.length) {
        return res.status(400).json({ message: "You can't delete a user with defined notes." });
    }

    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: "user not found." });
    }

    const userName = user.username;
    const userId = user._id;

    const result = await user.deleteOne();

    if (result) {
        const reply = `Username ${userName} with ID ${userId} has been eliminated.`;
        res.json(reply);
    } else {
        res.status(400).json({ message: "errore nella cancellazione dell'utente." });
    }
});

//@desc soft delete a user
//route POST /users
//@access Private
const softDeleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "mi devi fornire l'id del tizio da cancellare. Riprova." });
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({ message: "utente non trovato." });
    }

    if (user.active === false) {
        return res.json({ message: "l'utente selezionato è gia stato disattivato." });
    }

    user.active = false;
    const nomeUtente = user.username;
    await user.save();

    res.status(200).json({ message: `utente ${nomeUtente} disabilitato correttamente.` });
});

module.exports = {
    GetAllUsers,
    EditUser,
    CreateNewUser,
    DeleteUser,
    GetSingleUser,
    softDeleteUser,
};
