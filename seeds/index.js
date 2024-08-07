var mongoose = require("mongoose"),
  cities = require("./cities"),
  { places, descriptors } = require("./seedHelpers"),
  Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp_camp_1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images:[
        {
          url: 'https://res.cloudinary.com/dm4vhlkiq/image/upload/v1721468837/YelpCamp/kk0wyj0wztld3ha5anjn.png',
          filename: 'YelpCamp/kk0wyj0wztld3ha5anjn'
        },
        {
          url: 'https://res.cloudinary.com/dm4vhlkiq/image/upload/v1721468839/YelpCamp/m2cymbilbsimz6ot1pbp.png',
          filename: 'YelpCamp/m2cymbilbsimz6ot1pbp'
        },
      ],
      author: '669640d9ebb2ec2610ac398c',
      // image: `https://images.unsplash.com/photo-1520824071669-892f70d8a23d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60`,
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga dolorum, saepe ratione deleniti aperiam harum voluptatum repellat at, provident eligendi fugiat vero doloremque perspiciatis libero sit natus. Qui, adipisci facere.",
      price: Math.floor(Math.random() * 20) + 10,
      geometry: { type: 'Point', coordinates: [ cities[random1000].longitude, cities[random1000].latitude ] },

    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
