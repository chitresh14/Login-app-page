var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user');
passport.use('local',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
  },// email bind with username (argument in below function)
  function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.isValid(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
/*Each subsequent request will not contain credentials, but 
rather the unique cookie that identifies the session. 
In order to support login sessions,Passport will serialize 
and deserialize user instances to and from the session.*/

/*The user ID is serialized to the session, keeping the
 amount of data stored within the session small. When 
 subsequent requests are received, this ID is used to
  find the user, which will be restored to req.user. */
passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  // deserializeUser takes _id as id in argument
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });