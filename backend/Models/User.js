import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
        /*
        🔥 Store hashed password only
        Example:
        $argon2id$v=19$m=65536,t=3,p=4$xxxxx
        */
    },

    role: {
        type: String,
        default: "user"
    },

    address: {
        type: String,
        required: true
    },

    DOB: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true,
    collection: "Accounts"
});

export const Users = mongoose.model("Users", UserSchema);