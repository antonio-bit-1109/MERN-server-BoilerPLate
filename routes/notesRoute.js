const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");

// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)
router
    .route("/:userId")
    .get(notesController.GetAllUserNotes)
    .post(notesController.CreateNewNote)
    .patch(notesController.EditNote)
    .delete(notesController.DeleteNote);

router.route("/get-note").get(notesController.GetSingleNote);
// router.route("/get-user").post(usersController.GetSingleUser);
// router.route("/user-soft-delete").post(usersController.softDeleteUser);

module.exports = router;
