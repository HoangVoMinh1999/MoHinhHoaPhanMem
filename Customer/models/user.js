var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    firstname: { type: String, require: true, max: 100 },
    lastname: { type: String, require: true, max: 100 },
    username: { type: String, require: true, max: 100 },
    phone: { type: String, require: true, max: 12 },
    email: { type: String, require: true, max: 100 },
    address: { type: String, require: true, max: 300 },
    password: { type: String, require: true, max: 100 },
    isDeleted: { type: Boolean, require: true },
    role: { type: Number, required: true },
    wishlist: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' }
    }]
});

UserSchema.methods.validPassword = function(pwd) {

    return (this.password === bcrypt.hashSync(pwd, bcrypt.genSaltSync(10)));
};
module.exports = mongoose.model('User', UserSchema);