import jwt from "jsonwebtoken";
import Users from "../models/UserModel";
import {Response,NextFunction} from "express"
import RequestWithUser from "src/types/RequestWithUser";

require("dotenv").config();

const secret = process.env.JWT_SECRET;

interface JwtPayload{
    _id:String;
}

export const requireLogin =  async (req:RequestWithUser, res:Response, next:NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            error: "no headers provided",
        });
    }
    //Get the token from Bearer "token"
    const token = authorization.replace("Bearer ", "");
    
    const {_id} = jwt.verify(token,secret) as JwtPayload;

    req.user = await Users.findById({
        _id
    })
  
    next();
    
};