import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import Profile from "../models/Profile.js";
import mongoose from "mongoose";
//@desc delete user
//@route DELETE /api/users/:id
//@access admin only

async function deleteUser(req, res, next) {
    try {
        //check if user exists
        const user = await User.findById(req.params.id);
        if (!user) return next(new ErrorResponse("User not found", 404));
        user.removed = true;
        await user.save(); //save user

        //find profile and delete
        const profile = await Profile.findOne({ user: req.params.id });
        if (profile) {
            profile.removed = true;
            await profile.save();
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
        next();
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });
    }
}

//@desc unblock user
//@route PUT /api/users/:id/unblock
//@access admin only
async function unblockUser(req, res, next) {
    try {
        //check if user exists
        const user = await User.findById(req.params.id);
        if (!user) return next(new ErrorResponse("User not found", 404));
        user.removed = false;
        await user.save();
        res.status(200).json({
            success: true,
            message: "User unblocked successfully"
        });
        next();
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });
    }
}

//@desc make user admin
//@route PUT /api/users/:id/makeadmin

async function makeAdmin(req, res, next) {
    try {
        //check if user exists
        const user = await User.findById(req.params.id);
        if (!user) return next(new ErrorResponse("User not found", 404));
        //check if user is admin
        if (user.isAdmin) return next(new ErrorResponse("User is already an admin", 400));
        user.role = 1;
        await user.save();
        res.status(200).json({
            success: true,
            message: "User is now an admin"
        });
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });
    }
}


//@desc PROFILE RELATED CODES 
//@desc get single user
//@route GET /api/users/:id
//@access admin only
async function getUser(req, res, next) {
    const id = req.params.id;
    try {
        const user = await User.findById(id).select("-password");
        res.status(200).json({
            success: true,
            message: "Single user",
            user
        });
        next();
    }
    catch (err) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });
    }
}

//@desc get all users
//@route GET /api/users
//@access admin only
async function getUsers(req, res, next) {
    //paginate 
    const pageSizes = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find().sort({ createdAt: -1 }).
            select("-password").
            limit(pageSizes).
            skip(pageSizes * (page - 1));
        res.status(200).json({
            success: true,
            message: "All users",
            users,
            page,
            pages: Math.ceil(count / pageSizes),
            count
        });
        next();
    }
    catch (err) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });
    }
}

/***
 * @desc update user profile, user's profile is created automatically when a user is created
 * @route PUT /api/users/:id/profile
 * @access private
 * @param {*} req
 * @param {*} res
 * 
 */

async function updateUserProfile(req, res) {
    const { id: _id } = req.params;

    try {
        const profile = req.body;
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No client with that id')
        const updated = await Profile.findByIdAndUpdate(_id, { ...profile, _id }, { new: true });
        res.json({
            success: true,
            data: updated

        });
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            result: err.message
        });
    }


}




export { getUsers, getUser, 
   deleteUser,
     unblockUser, makeAdmin,
     updateUserProfile };