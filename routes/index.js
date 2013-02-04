var nodemailer = require('nodemailer');
var config_user = require('./config_user')
var smtptransport = nodemailer.createTransport("SMTP", {});
var nowdate = new Date();
var mail_data = {
    from: 'philipp.lutz@western-systems.de',
    to: 'philipp.lutz@western-systems.de'
};
var console= require('console');

/*
 * GET home page.
 */

exports.index = function (req, res) {
    if (req.params.user) {
		var d_hours = [];
		for(var i=9;i<18;i++)
			 {
				 d_hours.push(i+":00");
				 d_hours.push(i+":30");
				 }
	    
        res.render('form', {
            user: req.params.user,
            userlist: config_user.list,
			hours: d_hours,
            title: "Coming When?"
        });
    } else {
        res.render('index', {
            title: 'Express '
        });
    }
};

exports.send = function (req, res) {
    if (req.params.user) {
        res.render("email",{cometime:req.body.cometime,user:req.params.user},
			function(err,mailtext) {
				mail_data.html=err?err:mailtext;
				mail_data.subject=req.params.user+" coming today at "+req.body.cometime+"h";
				smtptransport.sendMail(mail_data);
			});
			
        res.render('sent', {
            cometime:req.params.cometime,
			user: req.params.user,
            title: "Coming When?"
        });
    } else {
        res.render('index', {
            title: 'Error? '
        });
    }
};
