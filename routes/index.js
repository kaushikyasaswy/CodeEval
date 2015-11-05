var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CIS 573 Project' });
});

router.get('/gitLogin', function(req, res) {
	res.render('gitPage', { username: null });
});

module.exports = router;
