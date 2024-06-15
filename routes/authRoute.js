const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middleware/loginLimiter");
// una volta giunti in userRoute questa diventa la root "/" da cui reindirizzare al controller specifico. (get , post , put , delete)
// router
//     .route("/")
//     .get(usersController.GetAllUsers)
//     .post(usersController.CreateNewUser)
//     .patch(usersController.EditUser)
//     .delete(usersController.DeleteUser);

// router.route("/get-user").post(usersController.GetSingleUser);
// router.route("/user-soft-delete").post(usersController.softDeleteUser);

// route per autenticare lo user (fare login)
router.route("/").post(loginLimiter, authController.autenticationUser);

// route per fornire un token di refresh al client
router.route("/refresh").get(authController.refresh);

// route per effettuare correttamente un logout
router.route("/logout").post(authController.logout);

module.exports = router;
