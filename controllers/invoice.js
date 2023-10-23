import Invoice from "../models/Invoice.js";
import invoiceSchema from "../helper/invoiceValidate.js";
import {
    calculateTotalHours,
    calculateTotalRate,
    calculateTotalTax,
    calculateSubTotal,
    calculateTotal
} from "../helper/calculation.js";

//@desc: create invoice
//@route: POST /api/invoice
//@access: private
async function createInvoice(req, res) {
    try {
        // Get data from request body
        const {
            client,
            items,
            taxRate,
            date,
            notes,
            status,
        } = req.body;

        // Calculate total hours worked
        const totalHours = calculateTotalHours(items[0].startTime, items[0].endTime);

        // Calculate subtotal
        const subTotal = calculateSubTotal(items);
        
        // Calculate total rate
        const totalRate = calculateTotalRate(totalHours, items[0].ratePay);
        
        // Calculate total tax
        const totalTax = calculateTotalTax(totalRate, taxRate);

        // Calculate total
        const total = calculateTotal(subTotal, totalTax);

        // Add totalHours to each item in the array
        items.forEach(item => {
            item.totalHours = totalHours;
        });

        // Validate the data using Yup
        await invoiceSchema.validate({
            client,
            items,
            taxRate,
            date,
            notes,
            status,
            totalHours,
            subTotal,
            totalRate,
            totalTax,
            total,
        });

        // Create and save the invoice
        const invoice = await Invoice.create({
            client,
            items,
            tax: totalTax, // Use the calculated totalTax value
            date,
            notes,
            status,
            totalHours,
            subTotal,
            totalRate,
            total,
        });

        // Save the invoice to the database
        const createdInvoice = await invoice.save();

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: createdInvoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}




//@desc: get all invoices
//@route: GET /api/invoice
//@access: private

async function getInvoices(req, res) {
    try {
        const invoices = await Invoice.find({ removed: false }).populate('client').sort({ createdAt: -1 });
    console.log(invoices);
        return res.status(200).json({
            success: true,
            data: invoices,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

export { createInvoice, getInvoices };