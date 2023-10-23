//import packages 
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
//local imports
import connectDB from './config/db.js';

//import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';  
//import middlewares
import errorHandler from './middleware/error.js';
//configurations
dotenv.config();
const app = express();  //initialize express
const PORT = process.env.PORT || 9000; //set port 

connectDB(); //connect to database

//user packages 
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan('common'));  
app.use(bodyParser.json({ limit: '30mb',}));
app.use(bodyParser.urlencoded({ extended:true}));
app.use(cookieParser());
app.use(cors());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
//error middleware
app.use(errorHandler);


//connect to the server and listen to the port
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});