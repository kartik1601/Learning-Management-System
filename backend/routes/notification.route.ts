import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotfication } from "../controllers/notification.controller";

const notificationRouter  = express.Router();


notificationRouter.get("/get-all-notifications",isAuthenticated,authorizeRoles('admin'),getNotifications);

notificationRouter.get("/update-notifications/:id",isAuthenticated,authorizeRoles('admin'),updateNotfication);


export default notificationRouter;