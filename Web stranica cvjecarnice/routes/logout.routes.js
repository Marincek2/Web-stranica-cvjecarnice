const express = require('express');
const router = express.Router();


// - obrisati sadržaj košarice
// - odjaviti registriranog korisnika iz sustava
// - napraviti redirect na osnovnu stranicu
router.get('/', function (req, res, next) {
    req.session.user = undefined;
    req.session.destroy((err) => {
        if(err) {
            //report possible error
            console.log(err)
        } else {
            //redirect to the main page
            res.redirect('./')
        }
    })
});

module.exports = router;
