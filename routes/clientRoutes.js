import express from 'express';
const router = express.Router();
import{isAuthenticated, isAdmin} from '../middleware/auth.js';
import {getClients, getClient, createClient, updateClient, deleteClient, getTotalClients,} from '../controllers/client.js';

//@desc  client routes
//@route GET /api/clients
//@access  Private
router.get('/', getClients);
// router.get('/search', searchClients);
router.get('/:id', getClient);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.get('/total', getTotalClients);


export default router;