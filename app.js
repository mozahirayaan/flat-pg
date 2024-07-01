const { hashSync } = require('bcrypt');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { UserModel, pg } = require('./config/database');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const passport = require('passport');
const otpGenerator = require('otp-generator')
const twilio = require('twilio');


const accountSid = '';
const authToken = '';
const client = twilio(accountSid, authToken);




app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://ayaan:1234@cluster0.idzcx6c.mongodb.net/flat-pg', collectionName: "sessions" }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

require('./config/passport');
require('./config/passport-google');


app.use(passport.initialize())
app.use(passport.session())

app.get('/',(req,res)=>{
    res.render("index")
})

app.get('/pricing',(req,res)=>{
    res.render("pricing")
})

app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("dashboard",{ user : req.user })
    } else {
        res.render("login")
    }
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/login', passport.authenticate('local', { successRedirect: 'dashboard' }))

app.post('/register', (req, res) => {
    
    let user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })

    user.save().then(user => console.log(user));

    res.send({ success: true })
})

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
})

app.get('/dashboard', async (req, res) => {
    try {
        // Query the database to find all documents in the 'pg' collection
        const pg1 = await pg.find({});

        // Check if the user is authenticated
        if (req.isAuthenticated()) {
            // Render the dashboard with user data and 'pg1' data
            res.render("dashboard", { user: req.user, pg1: pg1 });
        } else {
            // If not authenticated, send a 401 Unauthorized response
            res.status(401).send("Unauthorized");
        }

        // Log session and user details
        console.log(req.session);
        console.log(req.user.username);
    } catch (err) {
        // Handle any errors that occur during the database query or rendering
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
});




//OTP verification
app.get('/otp', (req, res) => {
    
    res.send(`
        <form action="/send-message" method="post">
            <label for="phoneNumber">Phone Number:</label>
            <input type="text" id="phoneNumber" name="phoneNumber">
            <button type="submit">Send Message</button>
        </form>
    `);
});

// Handle form submission
app.post('/send-message', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    
    const otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const message = `Hello from Twilio! ${otp}`;
    req.session.otp=otp;
    console.log(req.session.otp);
    // Send message using Twilio
    client.messages.create({
        body: message,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${phoneNumber}`
    })
    .then(message => {
        console.log(`Message sent to ${message.to}: ${message.body}`);
        res.send(`
        <form action="/verify" method="post">
            <label for="phoneNumber">OTP:</label>
            <input type="text" id="otp" name="otp">
            <button type="submit">Send Message</button>
        </form>
    `);
    })
    .catch(error => {
        console.error('Error sending message:', error);
        res.status(500).send('Error sending message');
    });
});
app.post("/verify",(req,res)=>{
    if(req.session.otp==req.body.otp){
        console.log("verifies");

    }
    else{
        console.log("no match");
    }
})



app.get("/loging",(req,res)=>{
    res.render('login-google');
})

app.get('/auth/google',
    passport.authenticate('google',{scope: ["email", "profile"]}));

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to home page or dashboard
        res.redirect('/');
    });



app.listen(3000, (req, res) => {
    console.log("Listening to port 3000");
})
