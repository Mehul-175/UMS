import express from "express";
import { protectedRoutes } from "../middlewares/auth.middleware.js";
import { activateUser, deactivateUser, getAllUsers } from "../controllers/admin.controller.js";
import { protectedRoles } from "../middlewares/role.middleware.js";


const Router = express.Router();
Router.use(protectedRoutes);

Router.get('/users', protectedRoles('admin'), getAllUsers);
Router.patch('/user/:id/activate', protectedRoles('admin'), activateUser);
Router.patch('/user/:id/deactivate', protectedRoles('admin'), deactivateUser);

export default Router;