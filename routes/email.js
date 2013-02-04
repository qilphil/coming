var nodemailer = require('nodemailer');
/*
 * GET users listing.
 */

exports.sent = function(req, res){
var smtptransport =  nodemailer.createTransport("SMTP", {});
var nowdate=new Date();
var mail_data = {
	from:'atpunkt@punktat.de',
	to:'atpunkt@punktat.de',
	subject:'TestEmail' + nowdate.toString(),
	text:'Test test test'


	};
  smtptransport.sendMail(mail_data);
  res.send("no email sent");
   
};
