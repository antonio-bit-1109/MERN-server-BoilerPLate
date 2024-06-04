const user = require("../models/User");
const note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//@desc get all users
//route GET /users
//@access Private
const GetAllUsers = asyncHandler(async (req, res) => {});

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
