import User from '../models/User.js';
import { registerValidate, loginValidate} from "../helper/authValidate.js"
import Profile from "../models/Profile.js";
import jwt from 'jsonwebtoken';
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

export { register, login, logout, getProfile };