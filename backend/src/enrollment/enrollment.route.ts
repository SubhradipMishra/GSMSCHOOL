import { Router } from "express";
import { enrollment } from "./enrollment.controller";



import { upload } from "../middleware/multer.middleware";

const EnrollmentRouter = Router();

EnrollmentRouter.post("/", upload.single('adharPicFile'), enrollment);

export default EnrollmentRouter;