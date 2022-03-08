import express from "express";
import {getUserById, signup} from "../controllers/authController";
const router = express.Router();

router.post("/signup",signup);
router.post("/getUser",getUserById);

export default router;