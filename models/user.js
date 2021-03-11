const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// adds on to the schema a username and password (hash and salt) fields
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);