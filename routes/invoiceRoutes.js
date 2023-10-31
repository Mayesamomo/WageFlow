import express from 'express';
const router = express.Router();
import {
  createInvoice,
  getInvoices,
  getClientInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  getRecentInvoices,
  getWeeklyEarnings,
  getMonthlyEarnings
} from '../controllers/invoice.js';

//@desc: invoice routes
router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/recent', getRecentInvoices); 
router.get('/client/:id', getClientInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.get('/earnings', getWeeklyEarnings);
router.get('/earnings/monthly', getMonthlyEarnings);

export default router;
