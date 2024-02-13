if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}


const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = require('./models/user');
const session = require('express-session');
const cors = require('cors');

const app = express();

// Connect to MongoDB
const mongoUrl = `${process.env.DB_Url}`;
// mongoose.connect('mongodb://127.0.0.1:27017/users')
mongoose.connect(mongoUrl)
.then(() => {
  console.log("MONGO CONNECTION OPEN")
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR!")
        console.log(err)
    })
    



app.use(bodyParser.json());
    
    // CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // replace with your frontend URL
  credentials: true,
};
app.use(cors(corsOptions));

// Session configuration
app.use(session({
  secret: `${process.env.SECRET}`, // replace with your own secret
  resave: false,
  saveUninitialized: false,
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'Public')));

app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'Public', 'index.html'))
})


// Register endpoint
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const newUser = new User({ username });

  User.register(newUser, password, (error) => {
    if (error) {
      console.log(error);
      res.status(400).send(error.message);
    } else {
      // user registered successfully
      res.status(200).send('User registered successfully');
      console.log(`${req.body.username} registered successfully`)
    }
  });
});

// Login endpoint
app.post('/login', passport.authenticate('local'), (req, res) => {
  // user authenticated successfully
  res.status(200).send('User authenticated successfully');
  console.log(`${req.body.username} logged in`)
});


// Logout endpoint
app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
  res.status(200).send('User logged out successfully');
  console.log(`${req.body.username} logged out`)
  });
});

// User endpoint
app.get('/api/user', (req, res) => {
  res.status(200).json(req.user);
});



// Start the server
const port = process.env.port || 4001

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
