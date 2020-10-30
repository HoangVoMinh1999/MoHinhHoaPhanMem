var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        imagePath: { type: String, max: 1000 },
        quantity: { type: Number },
        price: { type: Number },
        total: { type: Number }
    }],
    active: { type: Boolean, default: true },
    modifiedOn: { type: Date, default: Date.now },
    total: { type: Number }


}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);