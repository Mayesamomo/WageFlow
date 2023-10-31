import Invoice from "../models/Invoice";
import User from "../models/User";
import Client from "../models/Client";




//@desc: get total invoice amount for invoice chart 
//@route: GET /api/charts/invoices
//@access: private

async function getInvoiceAmount(req, res) { 
    try {
        const invoices = await Invoice.find({ removed: false });
        let total = 0;
        invoices.forEach((invoice) => {
            total += invoice.total;
        });
        res.status(200).json({
            success: true,
            message: "invoice amount fetched successfully",
            data: total,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
 }


    //@desc: get total invoice amount for invoice chart by month 
    //@route: GET /api/charts/invoices/monthly
    //@access: private

    async function getInvoiceAmountByMonth(req, res) {
        try {
            const invoices = await Invoice.find({ removed: false });
            let total = 0;
            invoices.forEach((invoice) => {
                total += invoice.total;
            });
            res.status(200).json({
                success: true,
                message: "invoice amount fetched successfully",
                data: total,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    async function getMonthlyInvoiceTotalsAndComparisons() {
        try {
          // Group invoices by month and calculate total amount for each month
          const monthlyInvoiceData = await Invoice.aggregate([
            {
              $group: {
                _id: {
                  year: { $year: '$date' },
                  month: { $month: '$date' },
                },
                totalAmount: { $sum: '$totalAmount' },
              },
            },
            {
              $sort: { '_id.year': 1, '_id.month': 1 },
            },
          ]);
      
          // Calculate month-over-month comparisons
          const comparisons = [];
          for (let i = 1; i < monthlyInvoiceData.length; i++) {
            const currentMonthData = monthlyInvoiceData[i];
            const previousMonthData = monthlyInvoiceData[i - 1];
            const monthYear = `${currentMonthData._id.month}/${currentMonthData._id.year}`;
      
            const comparison = {
              monthYear,
              currentMonthTotal: currentMonthData.totalAmount,
              previousMonthTotal: previousMonthData.totalAmount,
              monthOverMonthDifference: currentMonthData.totalAmount - previousMonthData.totalAmount,
            };
      
            comparisons.push(comparison);
          }
      
          return comparisons;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
      
     


      //@desc: get the sum of all clients   
        //@route: GET /api/charts/clients
        //@access: private

        async function getClientCount(req, res) {
            try {
                const clients = await Client.find({ removed: false });
                const total = clients.length;
                res.status(200).json({
                    success: true,
                    message: "client count fetched successfully",
                    data: total,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Error fetching client count",
                    message: error.message,
                });
            }
        }


        export { getInvoiceAmount, getInvoiceAmountByMonth, getClientCount };