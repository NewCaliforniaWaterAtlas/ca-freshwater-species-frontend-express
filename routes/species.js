var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('species', { title: 'Search by Species : Freshwater Species Database' });
});

module.exports = router;
