const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: {
            type: String,
            enum: ['S', 'M', 'L', 'XL', 'XXL'],
            required: false
        },
        color: {
            type: String,
            required: false
        }
    }],
    coupons: [{
        code: {
            type: String,
            required: true
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        }

    }],
    subtotal: {type: Number, default: 0},
    discount: {type: Number, default: 0},
    total: {type: Number, default: 0}
}, {timestamps: true});

cartSchema.methods.calculateTotals = function () {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + (item.product.sellingPrice * item.quantity), 0);
    this.discount = this.coupons.reduce((acc, coupon) => acc + (this.subtotal * (coupon.discountPercentage / 100)), 0);
    this.total = this.subtotal - this.discount;
}

cartSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
