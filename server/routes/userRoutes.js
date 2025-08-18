import express from "express"
import { login, checkAuth, signup, updateProfile } from "../controllers/userController.js";
import { proctectRoute } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/signup", signup)
userRouter.post("/login", login)
userRouter.put("/update-profile", proctectRoute, updateProfile);
userRouter.get("/check", proctectRoute, checkAuth);

export default userRouter;