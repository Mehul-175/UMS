import express from 'express'
import { protectedRoutes } from '../middlewares/auth.middleware.js';
import { getMyProfile } from '../controllers/user.controller.js';

const Router = express.Router();
Router.use(protectedRoutes);

Router.get('/me', getMyProfile)


export default Router;