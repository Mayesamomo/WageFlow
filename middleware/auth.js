import ErrorResponse from "../utils/errorResponse.js";  
import jwt from 'jsonwebtoken'; 
import User from '../models/User.js';   


//check if user is authenticated    

async function isAuthenticated(req, res, next){
    const {token} = req.cookies;
    //make sure token exists
    if(!token){
        return next(new ErrorResponse('UnAuthorized action', 401));
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }catch(err){
        return next(new ErrorResponse('UnAuthorized action', 401));
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