// import app from './index.js';
// import connectDB from './config/db.js';
// import dotenv from 'dotenv';
// import cloudinary from 'cloudinary';

// //handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//     console.log(`Error: ${err.message}`);
//     console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    
// });

// //config 
// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config(
//         {
//             path: './config/.env',
//         }
//     );
// }

// //connect to database
// connectDB();
// //connect to cloudinary

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY, 
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// //create server

// const server = app.listen(process.env.PORT, () => {
//     console.log(`Server is running on port ${process.env.PORT}`);
// });

// //handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//     console.log(`Shutting down the server for: ${err.message}`);
//     console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//     server.close(() => {
//         process.exit(1);
//     });
// });