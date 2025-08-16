import express from "express";
import { getAllChats, createChat } from "../controllers/chat.controllers.js";

const router = express.Router();

router.get("/get-all-chat", getAllChats);
router.post("/create-chat", createChat);

export default router;
