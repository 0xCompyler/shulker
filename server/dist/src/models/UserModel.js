"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Types;
const usersSchema = new mongoose_1.Schema({
    _id: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    profileImage: {
        type: String
    },
    categories: [{
            name: {
                type: String
            },
            channels: [{
                    name: {
                        type: String
                    },
                    url: {
                        type: String
                    },
                    title: {
                        type: String
                    },
                    channelId: {
                        type: String
                    }
                }]
        }]
});
const UsersModel = mongoose_1.model("UsersModel", usersSchema);
exports.default = UsersModel;
//# sourceMappingURL=UserModel.js.map