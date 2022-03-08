import feedFinder from "@hughrun/feedfinder";
import rssFinder from "rss-finder";
import express,{Request,NextFunction,Response} from "express";
import Users from "../models/UserModel";
import UserTypes from "../types/UserTypes";
import RequestWithUser from "src/types/RequestWithUser";
import ApiResponse from "../types/ApiResponse";

export const createCateogry = (req:RequestWithUser,res:Response,next:NextFunction) => {
        
    const {name} = req.body;
    //Checking if the user is already signed up or not

    Users.findByIdAndUpdate({
        _id:req.user._id
    }).then((user) => {
        const categories = user.categories.filter(
            (category) => category.name === name
        );

        if(categories.length === 0){

            Users.findByIdAndUpdate({
                _id:req.user._id
            },{
                $push:{
                    categories:{
                        name
                    }
                }
            },{
                runValidators:true,
                new:true
            })
            .then((user:UserTypes) => {
                const response:ApiResponse = {
                    success:true,
                    status:200,
                    data:user,
                    message:"Successfully created category"
                }
            
                res.status(200).json(response);
        
            })
            .catch(next);
        }
        else {
            next(new Error("Category with same name already exists"));
        }

    })
}

export const addChannels = (req:RequestWithUser,res:Response,next:NextFunction) => {

    const {categoryName,name,url,title,channelId} = req.body;

    console.log(categoryName,"cate",name,"name");
    Users.findById({
        _id: req.user._id,
    }).then((user) => {
        let categoryIndex = user.categories.findIndex((category) => {
            return category.name === categoryName
        })

        console.log(categoryIndex,"index");

        if (categoryIndex === -1) {
            next(new Error("Category doesnt exists"));
        } else {

            user.categories[categoryIndex].channels.push({
                name,
                url,
                title,
                channelId
            });

            user.save()
                .then((user:UserTypes) => {
                    const response:ApiResponse = {
                        success:true,
                        status:200,
                        data:user,
                        message:"Successfully added channel"
                    }
                
                    res.status(200).json(response);            
                })
                .catch(next);
        }
    });
};         

export const findFeed = async(req:Request,res:Response,next:NextFunction) => {

    const {url} = req.body as any;

    console.log("in");
    try {
        const res1 = await rssFinder(url);
        console.log("RES1", res1);

        let ytFavicon;
        const channelId = res1.feedUrls[0].url.split("?")[1].split("=")[1];
        console.log("CHANNEL_ID", channelId);        ;

        if (!res1.feedUrls.length || res1.feedUrls.length > 3) {
            try {
            const res2 = await feedFinder.getFeed(url);
            console.log("RES2", res2);
            const data = {
                ...res2,
                channelId,
                feed: res2.feed,
            }

            const response:ApiResponse = {
                success:true,
                status:200,
                data,
                message:"Successfully added channel"
            }
        
            res.status(200).json(response);            
            

            } catch (err) { 
                next(new Error("Feed not found"));
            }
        }

        const data = {
            url: res1.site.url,
            feed: res1.feedUrls[0].url,
            title: res1.site.title,
            channelId
            // favicon: ytFavicon || res1.site.favicon,
        };

        const response:ApiResponse = {
            success:true,
            status:200,
            data,
            message:"Successfully added channel"
        }
    
        res.status(200).json(response);            

    } catch (err) {
        next(new Error("Feed not found"));
    }
};
