const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')

//vrati login stranicu
router.get('/', function (req, res, next) {
    res.render('login', { err: undefined, user: req.session.user, linkActive: 'login' });
});

//postupak prijave korisnika
router.post('/', function (req, res, next) {

  (async () => {

      if( req.session.user !== undefined ) {
          res.render('login', { user: req.session.user, err: "Please log out first.", linkActive: 'login' });
          return;
      }

      let user = await User.fetchByUsername(req.body.user);

      if(user.user_name === req.body.user && user.checkPassword(req.body.password)){
          req.session.user = user;
          res.redirect('./');
      } else {
          res.render('login', { user: req.session.user, err: "Incorrect username or password.", linkActive: 'login' });
      }



  })();


});


module.exports = router;
