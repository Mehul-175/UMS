import './configEnv.js';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './utils/db.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);

app.use(cors({
  origin: "https://user-management-system-mu-five.vercel.app/",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.route.js';
import adminRoutes from './routes/admin.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);   
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
  connectDB();
});
