import express from 'express';
const router = express.Router();    
import { createInvoice, getInvoices } from '../controllers/invoice.js';

//@desc: invoice routes
router.post('/', createInvoice);
router.get('/', getInvoices);

export default router;
