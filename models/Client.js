import mongoose from "mongoose";
const ClientSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    company: {
        type: String,
        required: true,
        trim: true,
        maxlength: [32, "Company name can not be more than 32 characters"],
    },
    address: {
        type: String,
        required: false,
        trim: true,
    },
    country: {
        type: String,
        required: false,
        trim: true,
    },
    tel:{
        type: String,
        required: false,
        trim: true,
    },
    email: {
        type: String,
        required: false,
        trim: true,
        unique: true,   
    },
}, {timestamps: true});

const Client = mongoose.model("Client", ClientSchema);
export default Client;