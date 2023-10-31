import mongoose from 'mongoose'

const ProfileSchema = mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    name: String,
    email: { type: String, required: true, unique: true },
    phoneNumber: String,
    businessName: String,
    contactAddress: String,
    paymentDetails: String,
    logo: String,
    website: String,
    userId: [String],
    avatar: {
        public_id: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
    },
})

const Profile = mongoose.model('Profile', ProfileSchema)

export default Profile