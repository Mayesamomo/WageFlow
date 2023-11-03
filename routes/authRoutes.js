import express from 'express';
const router = express.Router();
import {register, login, logout, getProfile} from '../controllers/auth.js';
import { updateUserProfile } from '../controllers/user.js';
import {isAuthenticated} from '../middleware/auth.js';

//@desc auth routes 
//@route POST /api/auth/register
//@access Public
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', isAuthenticated, getProfile);

//@desc user routes
//@route PUT /api/profileclear

//@access Private
router.put('/profile', isAuthenticated, updateUserProfile);


export default router;