import express from 'express';
const router = express.Router();
import{isAuthenticated, isAdmin} from '../middleware/auth.js';
import {getUsers, getUser, editUserProfile,deleteUser,unblockUser, makeAdmin} from '../controllers/user.js';
import {getProfile} from '../controllers/auth.js';

//@desc user routes 
//@route POST /api/users
//@access admin only
router.get('/', isAuthenticated, getProfile);
router.get('/', isAuthenticated, isAdmin, getUsers);
router.get('/:id', isAuthenticated, getUser);
router.put('/:id', isAuthenticated, editUserProfile);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);
router.put('/:id/unblock', isAuthenticated, isAdmin, unblockUser);
router.put('/:id/makeadmin', isAuthenticated, isAdmin, makeAdmin);

export default router;
