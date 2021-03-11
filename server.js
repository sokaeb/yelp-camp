if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // the 'engine' used to parse/run ejs in a layout
const methodOverride = require('method-override');
const server = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const campgroundsRouter = require('./routes/campgrounds');
const reviewsRouter = require('./routes/reviews');
// const MongoStore = require('connect-mongo');
const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// this notifies if we connect successfully or if a connection error occurs
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

server.engine('ejs', ejsMate); // tells exp to use ejsMate 'engine' instead of the default ejs
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

// .use tells express to run the fns on every request
server.use(express.urlencoded({ extended: true}));
server.use(methodOverride('_method'));
server.use(express.static(path.join(__dirname, 'public')));
server.use(mongoSanitize());

// const store = new MongoDBStore.create({
//     url: dbUrl,
//     secret: process.env.SECRET || 'thisisasecret',
//     touchAfter: 24 * 60 * 60
// });

const secret = process.env.SECRET || 'thisisasecret';
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
}, session);

store.on('error', function(err){
    console.log('Session Store Error', err)
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
server.use(session(sessionConfig));
// server.use(session({
//     secret: 'foo',
//     store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/yelp-camp', resave: false, saveUninitialized: true })
// }));
server.use(flash());
server.use(helmet());


// security to allow resources from the below sources
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
server.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djl8jxoae/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


server.use(passport.initialize());
server.use(passport.session()); // allows for persistant login
passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser()); // how to store a user in a session
passport.deserializeUser(User.deserializeUser()); // how to remove a user from a session

// on every request the flash msgs are accessible under the locals prop under the key success
server.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)){
        // store the url user is requesting
        req.session.returnTo = req.originalUrl
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

server.use('/campgrounds', campgroundsRouter);
server.use('/campgrounds/:id/reviews', reviewsRouter);
server.use('/', usersRouter);

server.get('/', (req, res) => {
    res.render('home')
});



// .all is for every request, for every path not recognized, call the error handler fn
// this will only run if no previous paths matched
server.all('*', (req, res, next) => {
   next(new ExpressError('Page Not Found', 404))
});

// generic error handler with custom error class
server.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Something Went Wrong!"
    res.status(statusCode).render('error', { err });
});

server.listen(port, () => {
    console.log(`*** Running on port ${port} ***`)
});

