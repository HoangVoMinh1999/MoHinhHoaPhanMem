var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    imagePath: { type: String, require: true, max: 1000 },
    title: { type: String, require: true, max: 1000 },
    description: { type: String, require: true, max: 1000 },
    price: { type: Number, require: true },
    quantity: { type: Number, require: true },
    cateId: { type: Schema.Types.ObjectId, ref: 'Category', require: true },

});

module.exports = mongoose.model('Product', ProductSchema);