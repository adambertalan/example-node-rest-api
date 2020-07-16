var express = require('express');
var router = express.Router();
const { v4: uuid } = require('uuid');
const { body, validationResult } = require('express-validator');

var jwt = require('jsonwebtoken');

router.post('/login',
    body('username', "User name is required").not().isEmpty(),
    body('password', "Password is required").not().isEmpty(),
    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        const payload = {
            id: uuid(),
            name: username
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
