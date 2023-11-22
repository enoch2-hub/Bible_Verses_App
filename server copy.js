const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session')
const bodyParser = require('body-parser');
const User = require('./models/user.js');

const passport = require('passport');
const LocalStrategy = require('passport-local');
// const passportLocal = require('passport-local').Strategy;



const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/users')
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch((err) => {
        console.log("MONGO CONNECTION ERROR!")
        console.log(err)
    })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser("secret"))

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



//Routes
app.post('/login', passport.authenticate('local', {failureFlash:true, failureRedirect: '/login'}), (req,res) => {
    // const redirectUrl = req.session.returnTo || '/home';
    // delete req.session.returnTo;
    // res.redirect(redirectUrl)
    console.log(`${req.body.username} logged in`)
    
    // res.redirect('/home')

    
})




// app.post("/register", async (req,res) => {
//     User.findOne({username:req.body.username}, async(err,doc) => {
//         if(err) throw err;
//         if(doc) res.send('User already Exists');
//         if(!doc) {
//             const newUser = new User({
//                 email: req.body.email,
//                 username: req.body.username,
//                 password: req.body.password
//             });
//             await newUser.save();
//             res.send("User Created")
//         }
//     });
// });


app.post('/register', async(req,res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser)
        res.redirect('/home')
        

    } catch (e) {
        console.log(e)
        res.redirect('/register')
    }
})


app.get("/user", (req,res) => {
    
})




app.listen(4000, () => {
    console.log('port on 4000')
})