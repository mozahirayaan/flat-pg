const passport =require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { UserModel, pg } = require('./database');

passport.use(new GoogleStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: '/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
   
    let existingUser = await UserModel.findOne({ username: profile.emails[0].value });

    if (existingUser) {
        
        done(null, existingUser);
    } else {
        const newUser = new UserModel({
            googleid: profile.id,
            username: profile.emails[0].value,
            password: profile.id,
            email: profile.displayName ,
            // Add other user properties as needed
        });
        await newUser.save();
        done(null, newUser);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err, user) => {
        done(err, user);
    });
});
