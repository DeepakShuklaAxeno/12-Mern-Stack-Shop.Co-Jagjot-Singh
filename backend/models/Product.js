const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 150,
    },
    markedPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 1,
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    reviews: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        reviewText: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 500
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        }
    }],
    images: [{
        type: String,
        required: true,
        trim: true
    }],
    stockQuantity: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required: true,
    },
    sizeOptions: [{
        type: String,
        enum: ['S', 'M', 'L', 'XL', 'XXL'],
        uppercase: true
    }],
    colorOptions: [{
        type: String,
        trim: true,
    }]


}, {timestamps: true});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, sellingPrice: 1, stockQuantity: 1 });

module.exports = mongoose.model('Product', productSchema);