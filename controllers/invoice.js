import Invoice from "../models/Invoice.js";
import invoiceValidationSchema from "../helper/invoiceValidate.js";
import Client from "../models/Client.js";

//@desc: create invoice
//@route: POST /api/invoice
//@access: private
async function createInvoice(req, res) {
    try {
        // Temporarily removing 'totalHours' from the request body for validation purposes
        const { items, ...rest } = req.body;
        const itemsWithoutTotalHours = items.map((item) => {
            const { totalHours, ...itemWithoutTotalHours } = item;
            return itemWithoutTotalHours;
        });

        // Validate the modified request body
        await invoiceValidationSchema.validate({ ...rest, items: itemsWithoutTotalHours }, { abortEarly: false });

        // If validation is successful, create the invoice
        const newInvoice = new Invoice(req.body);
        const savedInvoice = await newInvoice.save();

        //attch invoice to the client 
        const client = await Client.findById(req.body.client);
        if (client) {
            client.invoices.push(savedInvoice._id);
            await client.save();
        }

        console.log(savedInvoice);
        return res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            data: savedInvoice,
        });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({
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
            message: "invoices fetched successfully",   
            data: invoices,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}

//@desc get one client's invoices

async function getClientInvoices(req, res) { 
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        if (!client) {
            return next(new ErrorResponse("client not found", 404));
        }
        if (client.removed) {
            return next(new ErrorResponse("client not found", 404));
        }

        //retrieve client invoices with client id 
        const invoices = await Invoice.find({ client: id, removed: false }).sort({ createdAt: -1 });
        const clientInvoices ={
            id: client._id,
            invoices: invoices,
        }
        res.status(200).json({
            success: true,
            message: "client invoices fetched successfully",
            data: clientInvoices,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
 }


 //@desc get one invoice
    //@route GET /api/invoice/:id
    //@access private

    async function getInvoice(req, res) {
        try {
            const { id } = req.params;	
            const invoice = await Invoice.findById(id).populate('client');

            if (!invoice || invoice.removed) {
               res.status(404).json({
                    success: false,
                    message: "invoice not found",

               });
            }
            res.status(200).json({
                success: true,
                message: "invoice fetched successfully",
                data: invoice,
            });
        } catch (error) {
            
        }
    }


    //@desc update invoice
    //@route PUT /api/invoice/:id
    //@access private
    async function updateInvoice(req, res) {  
        const { id } = req.params;
        try {
            const invoice = await Invoice.findById(id);
            if (!invoice || invoice.removed) {
                return next(new ErrorResponse("invoice not found", 404));
            }
            const updatedInvoice = await Invoice.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });
            res.status(200).json({
                success: true,
                message: "invoice updated successfully",
                data: updatedInvoice,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
     }

     //@desc delete invoice
        //@route DELETE /api/invoice/:id
        //@access private

        async function deleteInvoice(req, res) {
            try {
                const { id } = req.params;
                const invoiceId = await Invoice.findById(id);
                if (!invoiceId || invoiceId.removed) {
                    return res.status(404).json({
                        success: false,
                        message: "invoice not found",
                    });
                }
                const deletedInvoice = await Invoice.findByIdAndUpdate(
                    id,
                    { removed: true },
                    { new: true }
                );

                deletedInvoice.save();
                res.status(200).json({
                    success: true,
                    message: "invoice deleted successfully",
                    data: deletedInvoice,
                });
            } catch (error) {
                
            }
        }

export { createInvoice, getInvoices, getClientInvoices,getInvoice, updateInvoice, deleteInvoice};