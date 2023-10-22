import User from '../models/User.js';
import ErrorResponse from "../utils/errorResponse.js";
import { registerValidate, loginValidate} from "../helper/authValidate.js"
import Profile from "../models/Profile.js";

//@desc Register user
//@route POST /api/auth/register
//@access Public

async function register(req, res, next) {
    const { name, email, password, confirmPassword } = req.body;
    //password pattern
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z0-9!@#$%^&*()_+]{6,}$/;
    //email pattern
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    try {
        registerValidate(req, res, async () => {
            //check password and confirmPassword is match
            if (password !== confirmPassword) {
                return next(new ErrorResponse("Password does not match", 400));
            }
            if(!passwordPattern.test(password)) {
                return next(new ErrorResponse("Password must be at least (6) characters and contain at least one uppercase letter and one special character", 400));
            }
            //check email is valid
            
            if (!emailPattern.test(email)) {
                return next(new ErrorResponse("Invalid email address", 400));
            }
            // check for existing user , using email
            const isExist = await User.findOne({ email });
            if (isExist) return next(new ErrorResponse("Email already taken", 400));
            //create new user
            const user = await User.create({
                name,
                email,
                password,
            });

            // connect user to user's profile using id and virtually insert into profile
            const profile = await Profile.create({
                userId: user._id,
                name: user.name,
                email: user.email
            });
            //return user
            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user,
                profile
            });
        })
    } catch (err) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });

    }
}


//@desc Login user
//@route POST /api/auth/login
//@access Public

async function login(req, res, next) {
    const { email, password } = req.body;

    try {
        loginValidate(req, res, async () => {
            //check for existing user , using email
            const user = await User.findOne({ email });
            if (!user) return next(new ErrorResponse("invalid credential, if you are registered please check your credentials", 400));
            //check if password is correct
            const isMatch = await user.comparePassword(password);
            if (!isMatch) return next(new ErrorResponse("Invalid credentials", 400));
            //return user
            sendTokenResponse(user, 200, res);
        })
    } catch (err) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });

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