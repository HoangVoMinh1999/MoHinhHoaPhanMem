var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    products: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String },
        imagePath: { type: String, max: 1000 },
        quantity: { type: Number },
        price: { type: Number },
        total: { type: Number }
    }],
    status: { type: String, max: 100, required: true },
    quantity: { type: Number },
    total: { type: Number }


}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);