import {Schema,model,Types} from "mongoose";
import Users from "../types/UserTypes";
import Category from "../types/Category";

const {ObjectId} = Types;

const usersSchema = new Schema<Users>({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    profileImage:{
        type:String
    },
    categories:[{
        name:{
            type:String
        },
        channels:[{
            name:{
                type:String
            },
            url:{
                type:String
            },
            title:{
                type:String
            },
            channelId:{
                type:String
            }
        }]
    }]
})

const UsersModel = model<Users>("UsersModel",usersSchema);
export default UsersModel;