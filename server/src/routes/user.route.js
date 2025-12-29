import express from 'express'
import { protectedRoutes } from '../middlewares/auth.middleware.js';
import { changePassword, getMyProfile, updateProfile } from '../controllers/user.controller.js';

const Router = express.Router();
Router.use(protectedRoutes);

Router.get('/me', getMyProfile)
Router.put('/profile', updateProfile)
Router.put('/change-password', changePassword)


export default Router;