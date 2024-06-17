const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const verifyJWT = require("../middleware/verifyJWT");
// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)

//PUOI APPLICARE IL MIDDLEWARE PER VERIFICARE IL TOKEN ALLE SINGOLE ACTION OPPURE A TUTTO IL CONTROLLER INDIPENDENTEMENTE
//IN QUESTO MODO:

// router.use(verifyJWT);

router
    .route("/:userId")
    .get(verifyJWT, notesController.GetAllUserNotes)
    .post(verifyJWT, notesController.CreateNewNote)
    .patch(verifyJWT, notesController.EditNote)
    .delete(verifyJWT, notesController.DeleteNote);

router.route("/get-note/:userId").post(verifyJWT, notesController.GetSingleNote);

router.route("/completeNote/:userId").post(verifyJWT, notesController.CheckCompletedNote);
router.route("/uncheckNote/:userId").post(verifyJWT, notesController.UnCheckCompletedNote);

module.exports = router;
