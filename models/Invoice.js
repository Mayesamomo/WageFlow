import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";
import {
    calculateTotalItemHours,
    calculateTotalItemRate,
    calculateItemTax,
    calculateSubtotal,
    calculateInvoiceTax,
    calculateTotalInvoiceAmount
} from "../helper/calculation.js";
const { ObjectId } = mongoose.Schema;

mongoose.Promise = global.Promise;

const InvoiceSchema = new mongoose.Schema(
    {

        removed: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            required: true,
            trim: true,
            default: "pending",
            enum: ["pending", "paid", "canceled"],
        },
        invoiceNumber: {
            type: Number,
        },
        client: {
            type: ObjectId,
            ref: "Client",
            required: true,
            autopopulate: true,
        },

        date: {
            type: Date,
            required: true,
        },
        items: [{
            dateServed: {
                type: Date,
                required: true,
                validate: {
                    validator: function (value) {
                        return value <= new Date();
                    },
                    message: "Date served must be in the past or today",
                },
            },
            day: {
                type: String,
                required: true,
            },
            location: {
                type: String,
                trim: true,
            },
            startTime: {
                type: String,
                trim: true,
            },
            endTime: {
                type: String,
                trim: true,
            },

            totalHours: {
                type: Number,
                min: 0,
                // required: true,
            },
            ratePay: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            serviceType: {
                type: String,
                required: true,
                trim: true,
            },
            tax: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },
            totalRate: {
                type: Number,
                required: true,
                default: 0,
                min: 0, 
            }
        }],
        taxRate: {
            type: Number,
            required: false,
            min: 0,
        },
        notes: {
            type: String,
            trim: true,
            required: false,
        },
        pdfUrl: {
            public_id: {
                type: String,
                required: false,
              },
              url: {
                type: String,
                required: false,
              },
        },
        subTotal: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        totalTax: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        }
    },
    { timestamps: true });


    //@desc: pre-save middleware to calculate total rate, tax, subtotal, total tax, and total amount
    //@param next: middleware callback function
    //@return: none

    InvoiceSchema.pre("save", function (next) {
        this.items.forEach(item => {
            item.totalHours  = calculateTotalItemHours(item);
            item.totalRate = calculateTotalItemRate(item);
            item.tax = calculateItemTax(item, this.taxRate);
        });
        this.subTotal = calculateSubtotal(this.items);
        this.totalTax = calculateInvoiceTax(this.items, this.taxRate);
        this.totalAmount = calculateTotalInvoiceAmount(this.subTotal, this.totalTax);
        next();
    })

    // Auto-increment invoiceNumber before saving
    InvoiceSchema.pre("save", async function (next) {
        if (!this.invoiceNumber) {
          // If invoiceNumber is not set, auto-increment it
          const lastInvoice = await this.constructor.findOne({}, {}, { sort: { invoiceNumber: -1 } });
          this.invoiceNumber = (lastInvoice && lastInvoice.invoiceNumber + 1) || 1;
        }
        next();
      });
InvoiceSchema.plugin(autopopulate);
const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;

