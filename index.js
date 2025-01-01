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
    origin: 'http://localhost:5173',
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


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})