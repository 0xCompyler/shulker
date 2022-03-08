"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const { ObjectId } = mongoose_1.Types;
const categorySchema = new mongoose_1.Schema({
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
            description: {
                type: String
            }
        }]
});
const CategoriesModel = (0, mongoose_1.model)("CategoriesModel", categorySchema);
exports.default = CategoriesModel;
//# sourceMappingURL=CategoryModel.js.map