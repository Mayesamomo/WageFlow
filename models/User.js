import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
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
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,

}, { timestamps: true });

// Encrypt password using bcrypt   before saving to the database 
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//compare user password in the database and the one that the user typed in
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//return jsonwebtoken
UserSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
}
//@desc register user

UserSchema.statics.signup = async function (name, email, password) {
    //validate user email 
    if(!name || !email || !password) {
        throw new Error("All fields are required");
    }
    if(!validator.isEmail(email)) {
        throw new Error("Invalid email");
    }
// if(!validator.isLength(password, { min: 6, max: 32 })) {
//         throw new Error("Password must be at least (6) characters");
// }
    if(!validator.isStrongPassword(password)) {
        throw new Error("Password not strong enough");
    }

    //check if user exist
    const exists = await this.findOne({ email });
    if(exists) {
        throw new Error("Email already in use");
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        name,
        email,
        password: hash,
    });
    return user;
};

//@desc login user

UserSchema.statics.login = async function (email, password) {
    //validate user email 
    if(!email || !password) {
        throw new Error("All fields are required");
    }
    if(!validator.isEmail(email)) {
        throw new Error("Invalid email");
    }

    //check if user exist
    const user = await this.findOne({ email });
    if(!user) {
        throw new Error("user does not exist, please signup");
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error("Invalid credentials");
    }

    return user;
}
const User = mongoose.model("User", UserSchema);
export default User;