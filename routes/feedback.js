var express = require('express');
var router = express.Router();

var sweetCaptcha = new require('sweetcaptcha')(
  process.env.SWEETCAPTCHA_ID,
  process.env.SWEETCAPTCHA_KEY,
  process.env.SWEETCAPTCHA_SECRET
);

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(
  smtpTransport({
    host: process.env.SES_SMTP_HOST,
    port: process.env.SES_SMTP_PORT,
    secure: false,
    debug: true,
    auth: {
      user: process.env.SES_USER,
      pass: process.env.SES_PASS
    }
  }
));
console.log(transporter);

/* GET feedback form. */
router.get('/', function(req, res, next) {
  sweetCaptcha.api('get_html', { platform: 'js-sdk' }, function (err, html) {
    res.render('feedback', { title: 'Feedback : Freshwater Species Database', captcha: html });
  });
});

/* POST feedback form. */
router.post('/', function(req, res) {
  sweetCaptcha.api('check', {
    sckey: req.body['sckey'],
    scvalue: req.body['scvalue']},
    function(err, response) {
      if (err) return console.log(err);

      if (response === 'true') {
        var mailOptions = {
          from: 'Freshwater Feedback <info@statewater.org>',
          to: process.env.FEEDBACK,
          subject: 'freshwater species biodiversity feedback',
          replyTo: '"' + req.body['feedback-form-name'] + '" <' + req.body['feedback-form-email'] + '>',
          text: req.body['feedback-form-message'] +
              "\n\nYou can contact " +
              req.body['feedback-form-name'] +
              ' at ' +
              req.body['feedback-form-email'] +
              " or simply reply to this message.\n"
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Message sent: ' + info.response);
          }
        });
        res.send('Thanks! We have sent your message.');
      }

      else {
        console.log('Invalid Captcha');
        res.send('Try again');
      }

    });

});

module.exports = router;
