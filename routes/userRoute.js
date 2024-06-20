const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdminRole = require("../middleware/verifyAdminRole");

const fileUpload = require("express-fileupload");
const filePayloadExist = require("../middleware/filePayloadExist");
const fileExtentionLimiter = require("../middleware/fileExtentionLimiter");
const fileSizeLimiter = require("../middleware/fileSizeLimiter");
// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)

//PUOI APPLICARE IL MIDDLEWARE PER VERIFICARE IL TOKEN ALLE SINGOLE ACTION OPPURE A TUTTO IL CONTROLLER INDIPENDENTEMENTE
//IN QUESTO MODO:

// router.use(verifyJWT);

router
    .route("/")
    .get(verifyAdminRole, usersController.GetAllUsers)
    .post(verifyAdminRole, usersController.CreateNewUser)
    .patch(verifyJWT, usersController.EditUser)
    .delete(verifyJWT, usersController.DeleteUser);

// autenticazione prima di accedere al action  del getSingleUser
router.route("/get-user").post(verifyJWT, usersController.GetSingleUser);
router.route("/user-soft-delete").post(verifyJWT, usersController.softDeleteUser);

// route incaricata di effettuare l'upload delle immagini per lo user.
// diversi middleware;
// per verificare il token con la richiesta (verifyJWT)
// per controllare se è stato inserito un file nel formData (filePayloadExist)
// per controllare le estensioni consentite (fileExtentionLimiter)
// per controllare le dimensioni massime del file che si cerca di caricare (fileSizeLimiter)
router.route("/uploadUserImg/:userId").patch(
    verifyJWT,
    fileUpload({ createParentPath: true }), // (createParenthPath : true) se la cartella specificata dove salvare i file non esiste, viene creata automaticamente.
    filePayloadExist,
    fileExtentionLimiter([".png", ".jpeg", ".jpg", ".svg"]),
    fileSizeLimiter,
    usersController.changeImageProfile
);

module.exports = router;
