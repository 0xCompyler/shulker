import {Request,Response,NextFunction} from "express";
import ApiResponse from "src/types/ApiResponse";
import ErrorResponse from "../utils/ErrorResponse";

export const ErrorHandler = (err:any,req:Request,res:Response,next:NextFunction) => {

    let error = {...err};

    error.message = err.message;

    //Mongoose Bad ObjectId
    if(err.name === "CastError"){
        const message = "Resource not found";
        error = new ErrorResponse(message,404);
    }

    //Mongoose duplicate key
    if(err.code === 11000){
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message,400);
    }

    const response:ApiResponse = {
        status:error.statusCode,
        success:false,
        message:error.message || "Internal Server Error"
    }

    res.status(error.statusCode || 500).json(response);
} 
