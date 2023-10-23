import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";
// import { v4 as uuidv4 } from 'uuid';
const { ObjectId } = mongoose.Schema;

mongoose.Promise = global.Promise;

const InvoiceSchema = new mongoose.Schema(
    {
        // InvoiceId: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     unique: true,
        //     default: uuidv4(),
        // },
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
                required: true,
            },
            ratePay: {
                type: Number,
                required: true,
                default: 0,
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
            },
        }],
        taxRate: {
            type: Number,
            required: true,
            default: 0,
        },
        notes: {
            type: String,
            trim: true,
            required: false,
        },
        subTotal: {
            type: Number,
            required: true,
            default: 0,
        },
        totalTax: {
            type: Number,
            required: true,
            default: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    { timestamps: true });
InvoiceSchema.plugin(autopopulate);
const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;

