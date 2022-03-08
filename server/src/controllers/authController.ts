import express,{NextFunction, Request,Response} from "express";
import Users from "../models/UserModel";
import jwt from "jsonwebtoken";
import UserTypes from "../types/UserTypes";
import ApiResponse from "../types/ApiResponse";

require("dotenv").config();
const secret = process.env.JWT_SECRET;

export const signup = (req:Request,res:Response) => {
        
    const {_id, name, photo, email} = req.body;

    //Checking if the user is already signed up or not
    Users.findOne({
        email,
    })
    .then((user:UserTypes) => {
        if (user) {
            
            const token = jwt.sign(
            {
                _id: user._id,
            },
                secret
            );

            const response:ApiResponse = {
                success:true,
                status:200,
                data:{
                    user,
                    token
                },
                message:"Successfully signed in"
            }

            //The user details are already saved, so return the current user
            res.status(200).json(response);        
        }
        else{
            const newUser = new Users({
                _id,
                name,
                email,
                photo,
            });

            newUser
                .save()
                .then((savedUser) => {
                    const token = jwt.sign(
                    {
                        _id: savedUser._id,
                    },  
                        secret
                    );

                    const response:ApiResponse = {
                        success:true,
                        status:200,
                        data:{
                            savedUser,
                            token
                        },
                        message:"Successfully signed in"
                    }
                
                    res.status(200).json(response);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    });    
}

export const getUserById = (req:Request,res:Response,next:NextFunction) => {
    
    const {_id} = req.body;

    Users.findById({
        _id
    }).then((user) => {
        const response:ApiResponse = {
            success:true,
            status:200,
            data:user,
            message:"Successfully fetched user"
        }
    
        res.status(200).json(response);

    }).catch(next);
}
