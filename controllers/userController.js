// controllers/userController.js
const User = require('../models/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// GET /users - should return all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /users/:id - should return a single user
const getUserById = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        //return status 200 and the user
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /users - should create a new user
const createUser = async (req, res) => {
    try {
        //must have a email and password
        if (!req.body.email || !req.body.password) {
            res.status(400).json({ error: "Please provide an email and password" });
        } else {
            const user = await User.create(req.body);
            res.json(user);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /users/:id - should update a single user
const updateUser = async (req, res) => {
    try {
        //find by id
        const user = await User.findById(req.params.id);
        //update the user
        user.email = req.body.email;
        user.password = req.body.password;
        //save the user
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /users/:id - should delete a single user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST - /users/login - should login a user, register a token and return it
const loginUser = async (req, res) => {
    try {
        //must have a email and password
        if (!req.body.email) {
            res.status(400).json({ error: "Please provide an email" }
            );
        } else if (!req.body.password) {
            res.status(400).json({ error: "Please provide a password" }
            );
        } else {
            //find the user
            const user = await User
                .findOne({ email: req.body.email })

            //if the user exists
            user ? (
                //compare the password
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    //if the password is correct
                    if (result) {
                        //create a token
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        //return the token
                        res.status(200).json({ token: token });
                    } else {
                        res.status(400).json({ error: "Incorrect password" });
                    }
                })
            ) : (
                res.status(400).json({ error: "User not found" })
            );
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser
};