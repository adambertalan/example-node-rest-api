var express = require('express');
var router = express.Router();

var jwt = require('jsonwebtoken');

router.post('/login', function(req, res, next) {
    const payload = {
        id: 1,
        name: 'John Doe'
    }
    jwt.sign(
        payload,
        'not-bacon',
        {
            expiresIn: 60 * 5 // 5 min
        },
        (err, token) => {
            console.log('TOKEN: ', token);
            res.json({
                token
            });
        }
    );
});

module.exports = router;
