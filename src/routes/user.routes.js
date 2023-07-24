import { Router } from "express";
import { getUserByIdController, resetPasswordController, changeRoleController, uploadDocumentsController, getAllUsersController, deleteInactiveUsersController } from "../controllers/user.controller.js";
import { uploader } from "../utils/uploader.js";

const routerUser = Router()

routerUser.get("/", getAllUsersController);
routerUser.delete("/", deleteInactiveUsersController);
routerUser.get("/:id", getUserByIdController);
routerUser.post("/resetpassword", resetPasswordController);
routerUser.post("/:uid/documents", uploader.any(), uploadDocumentsController);
routerUser.put("/premium/:id", changeRoleController);

export default routerUser