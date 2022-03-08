import express from "express";
import { addChannels, createCateogry, findFeed } from "../controllers/categoryController";
import { requireLogin } from "../middlewares/requireLogin";
const router = express.Router();

router.post("/addCategory",requireLogin,createCateogry);
router.post("/addChannels",requireLogin,addChannels);
router.post("/findFeed",findFeed);

export default router;