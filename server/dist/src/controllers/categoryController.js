"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFeed = exports.addChannels = exports.createCateogry = void 0;
const feedfinder_1 = __importDefault(require("@hughrun/feedfinder"));
const rss_finder_1 = __importDefault(require("rss-finder"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const createCateogry = (req, res, next) => {
    const { name } = req.body;
    //Checking if the user is already signed up or not
    UserModel_1.default.findByIdAndUpdate({
        _id: req.user._id
    }).then((user) => {
        const categories = user.categories.filter((category) => category.name === name);
        if (categories.length === 0) {
            UserModel_1.default.findByIdAndUpdate({
                _id: req.user._id
            }, {
                $push: {
                    categories: {
                        name
                    }
                }
            }, {
                runValidators: true,
                new: true
            })
                .then((user) => {
                const response = {
                    success: true,
                    status: 200,
                    data: user,
                    message: "Successfully created category"
                };
                res.status(200).json(response);
            })
                .catch(next);
        }
        else {
            next(new Error("Category with same name already exists"));
        }
    });
};
exports.createCateogry = createCateogry;
const addChannels = (req, res, next) => {
    const { categoryName, name, url, title, channelId } = req.body;
    console.log(categoryName, "cate", name, "name");
    UserModel_1.default.findById({
        _id: req.user._id,
    }).then((user) => {
        let categoryIndex = user.categories.findIndex((category) => {
            return category.name === categoryName;
        });
        console.log(categoryIndex, "index");
        if (categoryIndex === -1) {
            next(new Error("Category doesnt exists"));
        }
        else {
            user.categories[categoryIndex].channels.push({
                name,
                url,
                title,
                channelId
            });
            user.save()
                .then((user) => {
                const response = {
                    success: true,
                    status: 200,
                    data: user,
                    message: "Successfully added channel"
                };
                res.status(200).json(response);
            })
                .catch(next);
        }
    });
};
exports.addChannels = addChannels;
const findFeed = async (req, res, next) => {
    const { url } = req.body;
    console.log("in");
    try {
        const res1 = await rss_finder_1.default(url);
        console.log("RES1", res1);
        let ytFavicon;
        const channelId = res1.feedUrls[0].url.split("?")[1].split("=")[1];
        console.log("CHANNEL_ID", channelId);
        ;
        if (!res1.feedUrls.length || res1.feedUrls.length > 3) {
            try {
                const res2 = await feedfinder_1.default.getFeed(url);
                console.log("RES2", res2);
                const data = {
                    ...res2,
                    channelId,
                    feed: res2.feed,
                };
                const response = {
                    success: true,
                    status: 200,
                    data,
                    message: "Successfully added channel"
                };
                res.status(200).json(response);
            }
            catch (err) {
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
        const response = {
            success: true,
            status: 200,
            data,
            message: "Successfully added channel"
        };
        res.status(200).json(response);
    }
    catch (err) {
        next(new Error("Feed not found"));
    }
};
exports.findFeed = findFeed;
//# sourceMappingURL=categoryController.js.map