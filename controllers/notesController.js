const Notes = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//@desc get all notes associated with a user
//route GET /Notes/:id (idutente passato nell url)
//@access Private
const GetAllUserNotes = asyncHandler(async (req, res) => {
    const UserId = req.params.userId;

    if (!UserId) {
        return res.status(400).json({ message: "UserId required." });
    }

    const notes = await Notes.find({ UserId: UserId }).select().exec();

    if (!notes || notes.length <= 0) {
        return res.status(400).json({ message: "there are no notes for selected user." });
    }

    if (notes) {
        return res.status(200).json(notes);
    }
});

const CreateNewNote = asyncHandler(async (req, res) => {
    const UserId = req.params.userId;
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
    const UserId = req.params.userId;
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

    const note = await Notes.findOne({ UserId: UserId, _id: IdNote }).exec();
    const user = await User.findOne({ _id: UserId }).lean().exec();
    if (!note) {
        return res.status(400).json({ message: "nota non trovata." });
    }

    if (textBody && textBody.trim() !== "") {
        // note.set({ text: textBody });
        note.text = textBody;
    }
    if (titleBody && titleBody.trim() !== "") {
        note.title = titleBody;
    }

    await note.save();

    return res.status(200).json({ message: `nota ${IdNote}, dello user ${user.username} modificata con successo.` });
});

const DeleteNote = asyncHandler(async (req, res) => {
    const UserId = req.params.userId;

    const { IdNote } = req.body;

    if (!UserId) {
        return res.status(400).json({ message: "non hai fornito userId" });
    }

    if (!IdNote) {
        return res.status(400).json({ message: "non hai fornito IdNote" });
    }
    const user = await User.findById(UserId).lean().exec();

    await Notes.deleteOne({ _id: IdNote });

    return res
        .status(200)
        .json({ message: `la nota con ID ${IdNote}, dell utente ${user.username} cancellata con successo.` });
});

const GetSingleNote = asyncHandler(async (req, res) => {
    const UserId = req.params.userId;
    const { NoteId } = req.body;
    //controllo dati
    if (!UserId) {
        return res.status(400).json({ message: "userId non trovato." });
    }

    if (!NoteId) {
        return res.status(400).json({ message: "id nota non trovato." });
    }

    const singleNote = await Notes.findById(NoteId).lean().exec();

    if (!singleNote) {
        return res.status(400).json({ message: "nota non trovata." });
    }

    return res.status(200).json(singleNote);
});

//inviare una post per impostare la nota come completa
const CheckCompletedNote = asyncHandler(async (req, res) => {
    const UserId = req.params.userId;
    const { NoteId } = req.body;

    if (!UserId || !NoteId) {
        return res.status(400).json({ message: "all fields are required." });
    }

    const note = await Notes.findOne({ UserId: UserId, _id: NoteId }).exec();

    if (!note) {
        return res.status(400).json({ message: "nessuna nota trovata corrispondente all'utente selezionato." });
    }

    if (note.isCompleted === true) {
        return res.json("la nota è già stata completata.");
    }

    note.isCompleted = true;
    await note.save();

    return res.status(200).json({ message: "nota impostata come completata." });
});

module.exports = {
    GetAllUserNotes,
    CreateNewNote,
    EditNote,
    DeleteNote,
    GetSingleNote,
    CheckCompletedNote,
};
