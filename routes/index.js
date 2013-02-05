var nodemailer = require('nodemailer');
var config_user = require('./config_user')
var console= require('console');

var smtptransport = nodemailer.createTransport("SMTP", {});
var nowdate = new Date();

var mail_data = {
    from: 'philipp.lutz@western-systems.de',
    to: 'philipp.lutz@western-systems.de'
};

/*
 * GET home page.
 */

function fixName(testName) {
    for (var checkName in config_user.list)
        if (testName.toLowerCase()==checkName.toLowerCase())
            return checkName;
    return testName;
};

exports.index = function (req, res) {
    if (req.params.user) {
        var formdata = {
            username:fixName(req.params.user),
            userlist: config_user.list,
            d_hours:[]
        }
		
        for(var i=9 ; i<18 ; i++)
    		 formdata.d_hours.push(i+":00",i+":30");
	    
        res.render('form', formdata);

    } else {
        res.render('index',{});
    }
};

exports.send = function (req, res) {
    if (req.params.user) {
        var username = fixName(req.params.user);
        
        res.render("email",{cometime:req.body.cometime,user:username},
			function(err,mailtext) {
				mail_data.html = err ? err : mailtext;
				mail_data.subject = username +  " coming today at " + req.body.cometime + "h";
				smtptransport.sendMail(mail_data);
			});
			
        res.render('sent', {
            cometime:req.params.cometime,
			user: username       
        });
    } else {
        res.render('index', {
            title: 'Error? '
        });
    }
};
