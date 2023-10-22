import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const ExpenseSchema = new mongoose.Schema(
    {
        removed: {
            type: Boolean,
            default: false,
        },
        amount: {
            type: Number,
            required: true,
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
    
        
      
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }

);