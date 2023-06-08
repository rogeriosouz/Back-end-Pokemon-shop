import { Router } from "express";
import upload from "../config/multer";
import UploadControllers from "../controllers/UploadControllers";
import authenticationAdim from "../middleware/adimMiddleware";

const uploadRouter = Router();

uploadRouter.post(
  "/upload",
  authenticationAdim,
  upload.single("file"),
  UploadControllers.upload
);

export default uploadRouter;
