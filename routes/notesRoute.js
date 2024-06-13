const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const autenticateMiddleware = require("../middleware/auth");
// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)
router
    .route("/:userId")
    .get(notesController.GetAllUserNotes)
    .post(autenticateMiddleware, notesController.CreateNewNote)
    .patch(autenticateMiddleware, notesController.EditNote)
    .delete(notesController.DeleteNote);

router.route("/get-note/:userId").post(autenticateMiddleware, notesController.GetSingleNote);

router.route("/completeNote/:userId").post(autenticateMiddleware, notesController.CheckCompletedNote);

module.exports = router;
