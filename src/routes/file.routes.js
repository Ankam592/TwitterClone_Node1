import { Router } from "express";
import { uploadPage,uploadFile,deleteFile } from "../controllers/upload.controller.js";
const filerouter = Router();



filerouter.route('/WeatherApp/uploadPage').get(uploadPage);



filerouter.route("/WeatherApp/fileUpload").post(
    upload.fields([{
        name : "fileUpload",
        maxCount : 1
    }]),
    uploadFile)

filerouter.route("/WeatherApp/deleteFile/id").delete(deleteFile);

export {filerouter};