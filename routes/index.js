var nodemailer = require('nodemailer');
var config_user = require('./config_user')
var console= require('console');

var smtptransport = nodemailer.createTransport("SMTP", {});
var nowdate = new Date();

var mail_data = {
    from: 'philipp.lutz@western-systems.de',
    to: 'philipp.lutz@western-systems.de'
};
var state_data = {}
/*
 * GET home page.
 */

function fixName(testName) {
    for (var checkName in config_user.list)
        if (testName.toLowerCase()==checkName.toLowerCase())
            return checkName;
    return testName;
};

var mailer = function(err,mailtext) {
                    mail_data.html = err ? err : mailtext;
                    mail_data.subject = state_data.username +  " coming today at " + state_data.cometime + "h";
                    smtptransport.sendMail(mail_data);
                };

exports.a = function (req, res) {
  if (req.params.user) {
     
     state_data.username = fixName(req.params.user);
            
     if (req.route.method == 'get')  {
            var formdata = {
            user:state_data.username,
            userlist: config_user.list,
            hours:[]
        }
        
        for(var i=9 ; i<18 ; i++)
             formdata.hours.push(i+":00",i+":30");

        res.render('form', formdata);
    }  else  { // POSTED
            state_data.cometime = req.body.cometime
            
            res.render("email", {
                cometime : state_data.cometime,
                user : state_data.username },
                mailer
                );
                
            res.render('sent', {
                cometime:state_data.cometime,
                user: state_data.username       
            });
       }
    }
    else {
        res.render('index', {});
    }
};
