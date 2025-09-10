import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
});

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
        unique: true
    },
    fullName: {
        type: String,
        // required: [true, 'Please provide your full name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    location: {
        city: {
            type: String,
            // required: [true, 'Please provide your city'],
            trim: true
        },
        zipCode: {
            type: String,
            // required: [true, 'Please provide your zip code'],
            trim: true
        },
        // GeoJSON for precise location mapping
        coordinates: {
            type: pointSchema,
            index: '2dsphere' // Creates a geospatial index for location-based queries
        }
    },
    skills: [{
        type: String,
        trim: true
    }],
    availability: {
        days: [{
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }],
        times: {
            start: String, // e.g., "09:00"
            end: String    // e.g., "17:00"
        }
    }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;