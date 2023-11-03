import User from '../models/User.js';
import { registerValidate, loginValidate} from "../helper/authValidate.js"
import Profile from "../models/Profile.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import ErrorResponse from "../utils/errorResponse.js";
import catchAsyncErrors from '../middleware/catchAsyncErrors.js';
import sendToken from "../utils/jwtToken.js";


//@desc create token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
}



//@desc Login user
//@route POST /api/auth/login
//@access Public

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        //create token
        const token = createToken(user._id);

        res.status(200).json({
            success: true,
            token,
            message: "login successfully",
            role: user.role
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


//@desc Register user
//@route POST /api/auth/register
//@access Public

async function register(req, res, next) {
    const { name, email, password } = req.body;
    try {
      const user = await User.signup(name, email, password);
  
      // Create token
      const token = createToken(user._id);
  
      // Insert user's profile into profile collection
      const profile = await Profile.create({
        user: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  
      res.status(200).json({
        success: true,
        token,
        message: "Registration successful",
        role: user.role,
        profile,
      });
    } catch (error) {
      // Handle errors and pass them to the error handler
      next(error);
    }
  }
   


//@desc send token 
async function sendTokenResponse (user, statusCode, res) {
    const token = await user.getJwtToken();
    res.status(statusCode)
    .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
    .json({
        success: true,
        role: user.role
    });
}

//@desc logout user
//@route GET /api/auth/logout   
//@access Private

async function logout(req, res, next) {
   res.clearCookie("token");
    res.status(200).json({
         success: true,
         message: "logout successfully"
    });
}

//@desc get current user
//@route GET /api/auth/profile
//@access Private

async function getProfile(req, res, next) {
    const user = await User.findById(req.user.id).select("-password");  
    res.status(200).json({
        success: true,
        data: user
    });
}

async function forgotPassword(req, res, next) {
    const { email } = req.body
  
    // NODEMAILER TRANSPORT FOR SENDING POST NOTIFICATION VIA EMAIL
     const transporter = nodemailer.createTransport({
         host: HOST,
         port : PORT,
         auth: {
         user: USER,
         pass: PASS
         },
         tls:{
             rejectUnauthorized:false
         }
     })


 crypto.randomBytes(32,(err,buffer)=>{
     if(err){
         console.log(err)
     }
     const token = buffer.toString("hex")
     User.findOne({email : email})
     .then(user=>{
         if(!user){
             return res.status(422).json({error:"User does not exist in our database"})
         }
         user.resetToken = token
         user.expireToken = Date.now() + 3600000
         user.save().then((result)=>{
             transporter.sendMail({
                 to:user.email,
                 from:"WageFlow <noreply@wageflow.vercel.app>",
                 subject:"Password reset request",
                 html:`
                 <p>You requested for password reset from Arc Invoicing application</p>
                 <h5>Please click this <a href="https://wageflow.vercel.app/reset/${token}">link</a> to reset your password</h5>
                 <p>Link not clickable?, copy and paste the following url in your address bar.</p>
                 <p>https://wageflow.vercel.app/reset/${token}</p>
                 <P>If this was a mistake, Please ignore the email.</P>
                 `
             })
             res.json({message:"Password reset link sent, please check your email"})
         }).catch((err) => console.log(err))

     })
 })
}
//@reset password
async function resetPassword(req, res, next) {
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
}
export { register, login, logout, getProfile,forgotPassword,resetPassword, };