var express = require('express');
var router = express.Router();

var recaptcha = require('express-recaptcha');
recaptcha.init(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET);

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
  res.render('feedback', { title: 'Feedback : Freshwater Species Database', captcha: recaptcha.render() });
});

/* POST feedback form. */
router.post('/', function(req, res) {
  recaptcha.verify(req, function(error) {
      if (!error) {
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
        res.send('Try again');
        return console.log(error);
      }

    });

});

module.exports = router;
