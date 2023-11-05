import ErrorResponse from "../utils/errorResponse.js";  
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js';   
import catchAsyncErrors from "./catchAsyncErrors.js";

//check if user is authenticated    
// const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//     const { token } = req.cookies;

//     if (!token) {
//         return next(new ErrorResponse("Please login to continue", 401));
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = await User.findById(decoded.id);

//     next();
// });

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization;

        if(!token){
            return next(new ErrorResponse('Unauthorized access. Please log in.', 401));
        }
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //find the user based on decoded user Id
        const user = await User.findById(decoded._id);

        if(!user){
            return next(new ErrorResponse('User not found', 404));
        }
        req.user =user;
        next() //proceed to the protected route
    } catch (error) {
        return next(new ErrorResponse('Unauthorized access. Please log in.', 401));
    }
 }


 //admin access middleware

 async function isAdmin(req, res, next){
    if(req.user && req.user.role === 1){
        next();
    }else{
        return next(new ErrorResponse('UnAuthorized action', 401));
    }   
 }

 export {isAuthenticated, isAdmin}; 