const Notes = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//@desc get all notes associated with a user
//route GET /Notes/:id (idutente passato nell url)
//@access Private
const GetAllUserNotes = asyncHandler(async (req, res) => {
    const UserId = req.params.id;

    if (!UserId) {
        return res.status(400).json({ message: "UserId required." });
    }

    const notes = await Notes.find({ UserId: UserId }).select().exec();

    if (!notes) {
        return res.status(400).json({ message: "there are no notes for selected user." });
    }

    if (notes) {
        return res.status(200).json(notes);
    }
});

const CreateNewNote = asyncHandler(async (req, res) => {
    const UserId = req.params.id;
    const { title, text } = req.body;

    // controllo se mi arrivano tutti i dati
    if (!UserId || !title || !text) {
        return res.status(400).json({ message: "all fields are required." });
    }

    //controllo che uno user non crei una nota uguale ad un altra, se quella gia presente è ancora IsCompleted : false
    const DuplicateNoteNotCompleted = await Notes.findOne({ UserId, text, title, isCompleted: false });

    if (DuplicateNoteNotCompleted) {
        return res
            .status(400)
            .json({ message: "You already have the same note not completed. Complete the note first, than retry." });
    }

    // creo oggetto nota da salvare nel db.
    const newNoteObj = { UserId, title, text };

    const note = await Notes.create(newNoteObj);

    // se ricevo indietro la nota creata da mongoDB allora la creazione è andata a buon fine.
    if (note) {
        return res.status(200).json("nota creata con successo.");
    }

    return res.status(400).json({ message: "errore  nella creazione della nota per l'utente selezionato." });
});

//@desc endpoint per la modifica di titolo o testo della nota
//route POST /Notes/:id (idutente passato nell url)
//@access Private
const EditNote = asyncHandler(async (req, res) => {
    // funzione parametrica per la gestione risposta in caso di dati mancanti
    const returnStatemen = (messageText) => {
        return res.status(400).json({ message: messageText });
    };

    // id dello user nel url
    const UserId = req.params.id;
    // id della nota da modificare nel body
    const { IdNote, titleBody, textBody } = req.body;

    //controllo dati
    if (!UserId) {
        let message1 = "userId is required.";
        returnStatemen(message1);
    }
    if (!IdNote) {
        let message2 = "NoteId is required.";
        returnStatemen(message2);
    }
    if (!UserId && !IdNote) {
        let message3 = "You are missing both userId And NoteId. check carefully.";
        returnStatemen(message3);
    }

    const Note = await Notes.find({ UserId: UserId, _id: IdNote }).exec();

    if (text) {
        Note.set({ text: textBody });
    }
    if (title) {
        Note.set({ title: titleBody });
    }

    await Note.save();

    return res.status(200).json({ message: `nota ${IdNote} modificata con successo.` });
});

const DeleteNote = asyncHandler(async (req, res) => {});
const GetSingleNote = asyncHandler(async (req, res) => {});

module.exports = {
    GetAllUserNotes,
    CreateNewNote,
    EditNote,
    DeleteNote,
    GetSingleNote,
};
