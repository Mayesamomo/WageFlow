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
    logo: String,
    website: String,
    userId: [String],
    
})

const Profile = mongoose.model('Profile', ProfileSchema)

export default Profile