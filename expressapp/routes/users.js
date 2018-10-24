var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/register',function(req,res,next){
  addToDB(req,res);
});

async function addToDB(req,res){

  var user = new User({
    email:req.body.email,
    username:req.body.username,
    password:User.hashPassword(req.body.password),
    creation_dt : Date.now()
  });
  try{
    doc = await user.save();
    console.log("DB return");
    return res.status(201).json(doc);
  }
  catch(err){
    return res.status(501).json(err);
  }
};

//Custom callback in passport
/*If the built-in options are not sufficient for handling
 an authentication request, a custom callback can be 
 provided to allow the application to handle success or 
 failure.*/
 //local is a stratergy name 
 router.post('/login',function(req,res,next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.status(501).json(info); } //message: 'Incorrect username.'
    req.logIn(user, function(err) { /* logIn function(provided by a passport)
      will call the serialize funtion and create a express
      cookie using the express session and other things*/
      if (err) { return res.status(501).json(err); }
      return res.status(200).json({message:'Login Success'});
    });
  })(req, res, next);
});

router.get('/user',isValidUser,function(req,res,next){
  
  /* If the user is authenticated then deserializer of passport
  cinfiguration will work and it will attach the current user with
  the request so that we can access the user using req.user*/
  return res.status(200).json(req.user);
});
router.get('/logout',isValidUser,function(req,res,next){
  req.logout(); //passport logout function
  return res.status(200).json({message:'Logout Success'});
})
/* We need a middleware function to check/ authenticate whether
user is loggedin or not.*/
function isValidUser(req,res,next){
  if(req.isAuthenticated()) next(); // passport method will check 
 else return res.status(401).json({message:'Unauthorized Request'});
}




// router.post('/register', function(req,res){
//   console.log(req.body);
  
//    let userObject = new User({
//     email:req.body.email,
//     username:req.body.username,
//     password:User.hashPassword(req.body.password),
//     creation_dt : Date.now()
//    });
//    return new Promise((resolve,reject)=>{
//      if(userObject){
//        userObject.save().then(function(saveData){
//          if(saveData){
//            res.status(201).json(doc);
//          }
//        });
//      }
//    });

// });

module.exports = router;
