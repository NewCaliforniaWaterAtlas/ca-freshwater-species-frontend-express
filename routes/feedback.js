var express = require('express');
var router = express.Router();

/* GET feedback form. */
router.get('/', function(req, res, next) {
  var sweetCaptcha = new require('sweetcaptcha')(
    process.env.SWEETCAPTCHA_ID,
    process.env.SWEETCAPTCHA_KEY,
    process.env.SWEETCAPTCHA_SECRET
  );
  sweetCaptcha.api('get_html', { platform: 'js-sdk' }, function (err, html) {
    res.render('feedback', { title: 'Feedback : Freshwater Species Database', captcha: html });
  });
});

module.exports = router;
