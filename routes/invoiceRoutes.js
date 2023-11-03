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
  getMonthlyEarnings,
  getInvoiceByUser,getTotalInvoices
} from '../controllers/invoice.js';

//@desc: invoice routes
router.post('/', createInvoice);
router.get('/', getInvoices);
router.get('/searchQuery', getInvoiceByUser);
router.get('/recent', getRecentInvoices); 
router.get('/client/:id', getClientInvoices);
router.get('/:id', getInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.get('/earnings', getWeeklyEarnings);
router.get('/earnings/monthly', getMonthlyEarnings);
router.get('/count', getTotalInvoices);

export default router;
