const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const autenticateMiddleware = require("../middleware/auth");

// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)
router
    .route("/")
    .get(usersController.GetAllUsers)
    .post(autenticateMiddleware, usersController.CreateNewUser)
    .patch(usersController.EditUser)
    .delete(usersController.DeleteUser);

// autenticazione prima di accedere al action  del getSingleUser
router.route("/get-user").post(autenticateMiddleware, usersController.GetSingleUser);
router.route("/user-soft-delete").post(usersController.softDeleteUser);

module.exports = router;
