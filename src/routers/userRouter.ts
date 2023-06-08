import { Router } from "express";
import UserController from "../controllers/UserController";
import authentication from "../middleware/userMiddleware";

const userRouter = Router();

userRouter.post("/auth/register", UserController.create);
userRouter.post("/auth/login", UserController.login);
userRouter.post("/auth/forgotPassword", UserController.forgotPassword);
userRouter.put("/auth/recoveryPassword/:token", UserController.recoveryPassword);
userRouter.put("/user/update", authentication, UserController.update);
userRouter.put(
  "/user/updatePassword",
  authentication,
  UserController.updatePassword
);

export default userRouter;
