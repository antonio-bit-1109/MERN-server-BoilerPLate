const user = require("../models/User");
const note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/User");

//@desc get all users
//route GET /users
//@access Private
const GetAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users) {
        return res.status(400).json({ message: "No users found." });
    }
    if (users) {
        return res.json(users);
    }
});

//@desc edit a user
//route PATCH /users
//@access Private
const EditUser = asyncHandler(async (req, res) => {});

//@desc create new user
//route POST /users
//@access Private
const CreateUser = asyncHandler(async (req, res) => {});

//@desc delete a user
//route DELETE /users
//@access Private
const DeleteUser = asyncHandler(async (req, res) => {});

module.exports = {
    GetAllUsers,
    EditUser,
    CreateUser,
    DeleteUser,
};
