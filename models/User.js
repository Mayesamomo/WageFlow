import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: [32, "Name can not be more than 50 characters"],
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [6, "Password must be at least (6) characters"],
    },
    role: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Encrypt password using bcrypt   before saving to the database 
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//compare user password in the database and the one that the user typed in
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

//return jsonwebtoken
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
}

const User = mongoose.model("User", UserSchema);
export default User;