const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)
// router
//     .route("/")
//     .get(usersController.GetAllUsers)
//     .post(usersController.CreateNewUser)
//     .patch(usersController.EditUser)
//     .delete(usersController.DeleteUser);

// router.route("/get-user").post(usersController.GetSingleUser);
// router.route("/user-soft-delete").post(usersController.softDeleteUser);

router.route("/").post(loginController.autenticationUser);

module.exports = router;
