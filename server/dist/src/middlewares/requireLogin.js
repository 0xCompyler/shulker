"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireLogin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const requireLogin = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: "no headers provided",
        });
    }
    //Get the token from Bearer "token"
    const token = authorization.replace("Bearer ", "");
    const { _id } = jsonwebtoken_1.default.verify(token, secret);
    req.user = await UserModel_1.default.findById({
        _id
    });
    next();
};
exports.requireLogin = requireLogin;
//# sourceMappingURL=requireLogin.js.map