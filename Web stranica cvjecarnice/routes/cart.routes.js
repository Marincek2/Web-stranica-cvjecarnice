const express = require('express');
const router = express.Router();
const cart = require('../models/CartModel');



//prikaz košarice uz pomoć cart.ejs
router.get('/', function (req, res, next) {
    res.render('cart', {
      err: undefined,
      user: req.session.user,
      linkActive: 'cart',
      cart: req.session.cart,
      title: 'Cart'
    });

});

//dodavanje jednog artikla u košaricu
router.get('/add/:id', function (req, res, next) {

    (async () => {
      if(req.session.user != undefined){
          if(req.app.users.getUser(req.session.user.user_name).cart === undefined)
              req.app.users.getUser(req.session.user.user_name).cart = cart.createCart();

          let id = parseInt(req.params.id);
          await cart.addItemToCart(req.app.users.getUser(req.session.user.user_name).cart, id, 1);

          req.app.users.store();
      } else {
          //ako user nije ulogiran, kosarica ja na razini sjednice
          if(req.session.cart == undefined){
              req.session.cart = cart.createCart();
          }
          let id = parseInt(req.params.id);
          await cart.addItemToCart(req.session.cart, id, 1);
      }
      res.end();
    })();



});

//brisanje jednog artikla iz košarice
router.get('/remove/:id', function (req, res, next) {
    (async () => {
      if(req.session.user != undefined){
          let id = parseInt(req.params.id);
          cart.removeItemFromCart(req.app.users.getUser(req.session.user.user_name).cart, id, 1);
          req.app.users.store();
      } else {
          let id = parseInt(req.params.id);
          cart.removeItemFromCart(req.session.cart, id, 1);
      }
      res.end();
    })();

});

module.exports = router;
