const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const reviewSchema = new Schema({
    body: String,
    rating: Number
});
// below line will add the field of username and password

module.exports = mongoose.model("Review", reviewSchema);