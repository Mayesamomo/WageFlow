import express from 'express';
const router = express.Router();
import { isAuthenticated, isAdmin } from '../middleware/auth.js';
import {
    getUsers, getUser
    , deleteUser,
    unblockUser, makeAdmin,
    updateUserProfile
} from '../controllers/user.js';
import { getProfile } from '../controllers/auth.js';

//@desc user routes 
//@route POST /api/users
//@access admin only
router.get('/',  getProfile);
router.get('/', isAuthenticated, isAdmin, getUsers);
router.get('/:id', isAuthenticated, getUser);
router.put('/:id', isAuthenticated, updateUserProfile);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);
router.put('/:id/unblock', isAuthenticated, isAdmin, unblockUser);
router.put('/:id/makeadmin', isAuthenticated, isAdmin, makeAdmin);

export default router;
