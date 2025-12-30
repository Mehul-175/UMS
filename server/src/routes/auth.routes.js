import express from 'express'
import { login, logout, register } from '../controllers/auth.controllers.js';
import { protectedRoutes } from '../middlewares/auth.middleware.js';

const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login)
Router.post('/logout', protectedRoutes, logout)

export default Router