import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import adminRoutes from './routes/admin.js'
import candidateRoutes from './routes/candidate.js'


dotenv.config();


const app = express();

const corsOptions = {
    origin: 'https://candidate-management-system-frontend.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.error('MongoDB connection error:', err));


app.use('/api/admin', adminRoutes);

app.use('/api/candidate', candidateRoutes);


const PORT = 3000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})