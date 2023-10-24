import express from 'express';
const router = express.Router();    
import { createInvoice, getInvoices,getClientInvoices,getInvoice,updateInvoice,deleteInvoice } from '../controllers/invoice.js';

//@desc: invoice routes
router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/client/:id', getClientInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

export default router;
