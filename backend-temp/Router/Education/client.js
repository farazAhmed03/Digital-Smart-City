import express from "express";
import { NewInstAdmssnReqFun } from "../../Controller/Education/client.js";
import { upload } from "../../Middleware/multer.js";
const EduClientRoutes = express.Router();


EduClientRoutes.post("/NewInstAdmissionReq", upload.any(), NewInstAdmssnReqFun);

export default EduClientRoutes;