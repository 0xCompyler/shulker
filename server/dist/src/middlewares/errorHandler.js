"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const ErrorResponse_1 = __importDefault(require("../utils/ErrorResponse"));
const ErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    //Mongoose Bad ObjectId
    if (err.name === "CastError") {
        const message = "Resource not found";
        error = new ErrorResponse_1.default(message, 404);
    }
    //Mongoose duplicate key
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse_1.default(message, 400);
    }
    const response = {
        status: error.statusCode,
        success: false,
        message: error.message || "Internal Server Error"
    };
    res.status(error.statusCode || 500).json(response);
};
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=errorHandler.js.map