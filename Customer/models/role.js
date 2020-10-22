var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RoleSchema = new Schema({
    name: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 }
});

// Virtual for bookinstance's URL
RoleSchema
    .virtual('url')
    .get(function() {
        return '/role/' + this._id;
    });

//Export model
module.exports = mongoose.model('Role', RoleSchema);