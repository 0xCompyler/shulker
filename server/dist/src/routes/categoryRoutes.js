"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const requireLogin_1 = require("../middlewares/requireLogin");
const router = express_1.default.Router();
router.post("/addCategory", requireLogin_1.requireLogin, categoryController_1.createCateogry);
router.post("/addChannels", requireLogin_1.requireLogin, categoryController_1.addChannels);
router.post("/findFeed", categoryController_1.findFeed);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map