/*
 * GET home page.
 */

var nodemailer = require('nodemailer'),
        config_user = require('./config_user'),
        extend = require('xtend');

var smtptransport = nodemailer.createTransport("SMTP", {});
var nowdate = new Date();

var mail_data = {
    from: 'philipp.lutz@western-systems.de',
    to: 'philipp.lutz@western-systems.de'
};
var state_data = {};

function fixName(testName) {
    for (var checkName in config_user.list)
        if (testName.toLowerCase() === checkName.toLowerCase())
            return checkName;
    return testName;
}


function mailer(err, mailtext) {
    mail_data.html = err ? err : mailtext;
    mail_data.subject = state_data.username + " coming today at " + state_data.cometime + "h";
    smtptransport.sendMail(mail_data);
}

exports.a = function(req, res) {
    if (req.params.user) {

        state_data.username = fixName(req.params.user);

        if (req.route.method === 'get') {
            var formdata = {
                user: state_data.username,
                userlist: config_user.list,
                hours: []
            };

            for (var hour = 9; hour < 18; hour++)
                formdata.hours.push(hour + ":00", hour + ":30");

            res.render('form', formdata);
        } else { // POSTED
            var mail_to_list = [];
            for (var send_to in req.body.sendto)
                if (config_user.list[send_to])
                    mail_to_list.push(config_user.list[send_to]);

            mail_data.to = mail_to_list.join(',');
            mail_data.to = "atpunkt@punktat.de"; // remove for production

            res.render("email", extend(req.body, {user: state_data.username}), mailer);

            res.render('sent', {
                cometime: state_data.cometime,
                user: state_data.username
            });
        }
    }
    else {
        res.render('index', {});
    }
};
