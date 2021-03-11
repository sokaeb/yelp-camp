const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


// this notifies if we connect successfully or if a connection error occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Seeds database connected');
});

// to pick a random element from an array-- pass in the arr and return random el from it
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    // seeds start by deleting everything
    await Campground.deleteMany({});
    // creates a random list of 50 cities 
    for(let i = 0; i < 200; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60467a359a43c615b96875e1',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem cumque facilis repellendus provident optio at iste numquam.',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
            ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/djl8jxoae/image/upload/v1615302812/YelpCamp/vnkiz6xqmtgzftncyawg.jpg',
                  filename: 'YelpCamp/vnkiz6xqmtgzftncyawg'
                },
                {
                  url: 'https://res.cloudinary.com/djl8jxoae/image/upload/v1615302812/YelpCamp/vnkiz6xqmtgzftncyawg.jpg',
                  filename: 'YelpCamp/vnkiz6xqmtgzftncyawg'
                }
              ]
        })
        await camp.save();
    }
}

// seedDB is an async fn which returns a promise, closing the connection
seedDB().then(() => {
    mongoose.connection.close();
})