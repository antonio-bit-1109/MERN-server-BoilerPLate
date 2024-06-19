const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const verifyAdminRole = require("../middleware/verifyAdminRole");
const fileUpload = require("express-fileupload");
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
router.route("/uploadUserImg/:userId").patch(verifyJWT, fileUpload(), usersController.changeImageProfile);
module.exports = router;
