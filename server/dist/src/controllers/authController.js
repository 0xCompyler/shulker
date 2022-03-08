"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.signup = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const signup = (req, res) => {
    const { _id, name, photo, email } = req.body;
    //Checking if the user is already signed up or not
    UserModel_1.default.findOne({
        email,
    })
        .then((user) => {
        if (user) {
            const token = jsonwebtoken_1.default.sign({
                _id: user._id,
            }, secret);
            const response = {
                success: true,
                status: 200,
                data: {
                    user,
                    token
                },
                message: "Successfully signed in"
            };
            //The user details are already saved, so return the current user
            res.status(200).json(response);
        }
        else {
            const newUser = new UserModel_1.default({
                _id,
                name,
                email,
                photo,
            });
            newUser
                .save()
                .then((savedUser) => {
                const token = jsonwebtoken_1.default.sign({
                    _id: savedUser._id,
                }, secret);
                const response = {
                    success: true,
                    status: 200,
                    data: {
                        savedUser,
                        token
                    },
                    message: "Successfully signed in"
                };
                res.status(200).json(response);
            })
                .catch((err) => {
                console.log(err);
            });
        }
    });
};
exports.signup = signup;
const getUserById = (req, res, next) => {
    const { _id } = req.body;
    UserModel_1.default.findById({
        _id
    }).then((user) => {
        const response = {
            success: true,
            status: 200,
            data: user,
            message: "Successfully fetched user"
        };
        res.status(200).json(response);
    }).catch(next);
};
exports.getUserById = getUserById;
//# sourceMappingURL=authController.js.map