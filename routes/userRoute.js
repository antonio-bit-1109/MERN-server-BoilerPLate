const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");

// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)

//PUOI APPLICARE IL MIDDLEWARE PER VERIFICARE IL TOKEN ALLE SINGOLE ACTION OPPURE A TUTTO IL CONTROLLER INDIPENDENTEMENTE
//IN QUESTO MODO:

router.use(verifyJWT);

router
    .route("/")
    .get(usersController.GetAllUsers)
    .post(usersController.CreateNewUser)
    .patch(usersController.EditUser)
    .delete(usersController.DeleteUser);

// autenticazione prima di accedere al action  del getSingleUser
router.route("/get-user").post(usersController.GetSingleUser);
router.route("/user-soft-delete").post(usersController.softDeleteUser);

module.exports = router;
