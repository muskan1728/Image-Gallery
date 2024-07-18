const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});
// below line will add the field of username and password

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema)