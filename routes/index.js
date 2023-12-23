const express = require('express');
const router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const upload = require("./multer")

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login', {error: req.flash('error')});
});

router.get('/feed', (req, res) => {
  res.render('feed');
});

router.post('/upload', isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("No file was given");
  }
  
  // Find the user
  const user = await userModel.findOne({ username: req.session.passport.user });
  // Check if the user is found
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Create a new post
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });

  // Update the user's posts
  user.posts.push(post._id);
  await user.save();

  res.redirect("/profile");
});


router.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({ username: req.session.passport.user })
  .populate("posts");
  res.render("profile", {user});
});

router.post("/register", (req, res) => {
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullName: fullname });

  userModel.register(userData, req.body.password)
  .then(()=>{
    passport.authenticate("local")(req, res, ()=>{
      res.redirect("/profile")
    })
  })
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), (req, res) => {});


router.get("/logout", (req, res)=> {
  req.logout((err)=>{
    if(err){return next(err);}
    res.redirect("/login")
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) 
  return next();
  res.redirect("/login");
}

module.exports = router;
