import express from "express";
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import path from 'path';
import morgan from "morgan";
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import {verifyToken} from './middleware/auth.js'
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js'


// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config()
const app = express()

// MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({
    policy: 'cross-origin'
}))
app.use(morgan('common'))

app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});


// ROUTES WITH FILES

app.post('/auth/register', upload.single('picture'), register);
app.post('/posts',verifyToken, upload.single('picture'), createPost);



// ROUTES

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);














const PORT = process.env.PORT || 6000;
const URL = process.env.MONGO_URL;


// MONGODB CONNECTION  

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log('mongodb connected successfully....');
}).catch((err) => {
    console.error('error occured while connecting to mongodb: ' + err);
})


app.listen(PORT, () => {
    console.log(`app started listening on http://localhost:${PORT}/`);
})