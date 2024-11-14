import { Router } from "express";
import { deleteMessage, editMessage, getAllMessages } from "../controllers/message.controller";

const messageRoute = Router();

messageRoute.post("/getAllMessages", getAllMessages);
messageRoute.post("/editMessage", editMessage);
messageRoute.post("/deleteMessage", deleteMessage);

export default messageRoute