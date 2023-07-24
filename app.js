const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const config = require('config');

const app = express();
const port = config.express.port;

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

//view engine
app.set('view engine', 'ejs');


//connect to MongoDB
const dbURI = config.mongoDb.connection;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log(result.connection)
        app.listen(port, () => console.log(`Listening to port ${port}`))
    })
    .catch((err) => console.log('MongoDB connection error:', err));


// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('homePage'));
app.get('/selectFriends', requireAuth, (req, res) => res.render('selectFriends'));
app.use(authRoutes);
