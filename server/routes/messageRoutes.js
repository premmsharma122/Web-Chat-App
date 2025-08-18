import express from "express"
import { proctectRoute } from "../middleware/auth.js";
import { getMessages, getUserForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", proctectRoute, getUserForSidebar)
messageRouter.get("/:id", proctectRoute, getMessages)
messageRouter.put("/mark/:id", proctectRoute, markMessageAsSeen)
messageRouter.post("/send/:id", proctectRoute, sendMessage);

export default messageRouter;