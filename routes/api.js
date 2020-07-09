var express = require('express');
var router = express.Router();

router.get('/data', function (req, res, next) {
    res.json({
        data: 'teapot'
    });
});

module.exports = router;