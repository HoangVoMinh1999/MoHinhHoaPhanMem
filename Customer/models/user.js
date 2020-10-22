var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: { type: String, require: true, max: 100 },
    lastname: { type: String, require: true, max: 100 },
    username: { type: String, require: true, max: 100 },
    phone: { type: String, require: true, max: 12 },
    email: { type: String, require: true, max: 100 },
    password: { type: String, require: true, max: 100 },
    role: { type: Schema.Types.ObjectId, ref: 'Role', require: true }
});

UserSchema.methods.validPassword = function(pwd) {

    return (this.password === pwd);
};
module.exports = mongoose.model('User', UserSchema);