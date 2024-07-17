var mongoose = require("mongoose");
const Review = require('./review');
const Schema = mongoose.Schema;

var CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

// element deleted and passed to function
CampgroundSchema.post('findOneAndDelete',async function(doc){
  if(doc){
    await Review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
  }
})
module.exports = mongoose.model('Campground',CampgroundSchema)