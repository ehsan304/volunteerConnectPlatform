import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false // Prevents password from being returned in queries by default
    },
    role: {
        type: String,
        required: true,
        enum: ['volunteer', 'organizer'],
        default: 'volunteer'
    }
}, {
    timestamps: true
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password correctness
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Static method to find user by email for login
userSchema.statics.findByEmail = function (email) {
    return this.findOne({ email }).select('+password +role'); // Explicitly include password & role
};

const User = mongoose.model('User', userSchema);

export default User;