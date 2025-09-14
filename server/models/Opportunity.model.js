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

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the opportunity'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please provide a full address']
        },
        city: {
            type: String,
            required: [true, 'Please provide a city']
        },
        zipCode: {
            type: String,
            required: [true, 'Please provide a zip code']
        },
        coordinates: {
            type: pointSchema,
            index: '2dsphere',
            // required: true
        }
    },
    
    requiredSkills: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return Array.isArray(v);
            },
            message: 'Required skills must be an array'
        }
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date for the opportunity']
    },
    time: {
        start: String,
        end: String
    },
    volunteersNeeded: {
        type: Number,
        required: true,
        min: 1
    },
    volunteersRegistered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Index for text search on title and description
opportunitySchema.index({
    title: 'text',
    description: 'text'
});

// Compound index for efficient filtering
opportunitySchema.index({
    date: 1,
    'location.city': 1
});

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;