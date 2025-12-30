import './configEnv.js';
import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import { connectDB } from './utils/db.js';

const app = express();
const PORT = process.env.PORT || 8000;


//Middlewares
// app.use(cors({
//     origin: "http://localhost:5174",
//     credentials: true
// }));
app.use(express.json());
app.use(cookieParser());

//Routes
import authRoutes from './routes/auth.routes.js'
app.use('/api/auth', authRoutes);
import userRoutes from './routes/user.route.js'
app.use('/api/user', userRoutes)
import adminRoutes from './routes/admin.routes.js'
app.use('/api/admin', adminRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on port: ${PORT}`)
    connectDB();
})