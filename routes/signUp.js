var mysql = require('mysql');
var twilio = require('twilio');
var session = require('client-sessions');
var config = require('./../configurations/config');
var nodemailer = require("nodemailer");
var https = require("https");

//Connection data
var connection_data = {
		host     : config.db_host,
		user     : config.db_user,
		password : config.db_password,
		database : config.db_database
};

function createUser(req, res) {
	var smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: config.gmail_uname,
			pass: config.gmail_pwd
		}
	});
	
	var options = {
			host :"api.github.com",
			path : '/users/'+req.body.github,
			method : 'GET',
			headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
	}
	var request = https.request(options, function(response){
		var body = '';
		response.on('data',function(chunk){
			body+=chunk;
		});
		response.on('end',function(){
			if (body.indexOf("Not Found") > -1) {
				console.error('[signUp.js] : Github not found : ' + err.stack);
				res.render('registerPage.ejs', {message: 'github does not exist'});
				return;
			}
			else {
				var connection_pool = mysql.createPool(connection_data);
				connection_pool.getConnection(function(err, connection) {
					if (err) {
						console.error('[signUp.js] : Error connecting to database : ' + err.stack);
						res.render('error.ejs', {message: 'unable to connect to database at this time'});
						return;
					}
					
					connection.query("select * from Login where username='" + req.body.username + "'", function(err, rows, fields) {
						if (!err) {
							console.log(rows);
							if (rows.length != 0) {
								res.render('registerPage.ejs', {message: 'username already exists'});
								return;
							}
							else {
								var code = random(10000,100000);
								var row = {username:req.body.username, password:req.body.password, isVerified:"false", accType:req.body.acctype, verificationcode:code};
								connection.query('insert into Login set ?', row, function(err, rows, fields) {
									if (!err) {
										send_sms(code, req.body.phone);
										smtpTransport.sendMail({
											from: "CodeScore",
											to: req.body.username,
											subject: "Verification for your account",
											html: "<h1>Howdy!\n\nThank you for choosing CodeScore</h1>. Please enter the following verification code to verify your identity.\n<b>Your verification code is "+code+"</b>\n\n\n<br>Best,\nCodeScore Customer Service Team"
										}, function(error, response){
											if(error){
												console.log(error);
											}else{
												console.log("Message sent: " + response.message);
											}
										});
										if (req.body.acctype == 'student') {
											var row = {username:req.body.username, firstname:req.body.firstname, lastname:req.body.lastname, githubid:req.body.github, phoneno:req.body.phone, universityid:req.body.uid};
											connection.query('insert into Student set ?', row, function(err, rows, fields) {
												if (!err) {
													req.session.username = req.body.username;
													req.session.name = req.body.firstname;
													req.session.gitid = req.body.github;
													res.render('signUpVerificationPage.ejs', {message: 'welcome', code: code});
													return;
												}
												else {
													console.error('[signUp.js] : Error querying login table1 : ' + err.stack);
													res.render('error.ejs', {message: 'Unable to query database at this time'});
													return;
												}
											});
										}
										else {
											var row = {username:req.body.username, firstname:req.body.firstname, lastname:req.body.lastname, phoneno:req.body.phone, univid:req.body.uid};
											connection.query('insert into Professor set ?', row, function(err, rows, fields) {
												if (!err) {
													req.session.username = req.body.username;
													req.session.name = req.body.firstname;
													res.render('signUpVerificationPage.ejs', {message: 'welcome', code: code});
													return;
												}
												else {
													console.error('[signUp.js] : Error querying login table2 : ' + err.stack);
													res.render('error.ejs', {message: 'Unable to query database at this time'});
													return;
												}
											});
										}
									}
									else {
										console.error('[signUp.js] : Error querying login table3 : ' + err.stack);
										res.render('error.ejs', {message: 'Unable to query database at this time'});
										return;
									}
								});
							}
						}
						else {
							console.error('[signUp.js] : Error querying Login table4 : ' + err.stack);
							res.render('error.ejs', {message: 'Unable to query database at this time'});
							return;
						}
					});
					connection.release();
				});
			}
		});
	});
	request.on('error', function(e) {
		console.error('and the error is '+e);
		return false;
	});
	request.end();
	
	
	
	
};

function random(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

function send_sms(code, phone) {
	var client = new twilio.RestClient(config.twilio_sid, config.twilio_token);
	client.sms.messages.create({
		to:'+1'+phone,
		from:config.twilio_phone,
		body:'Verification Code for CodeScore: ' + code + '. Please enter this in the website to verify your account'
	}, function(error, message) {
		if (!error) {

		} 
		else {
			console.log('[signUp.js] : Twilio Error');
		}
	});
}

exports.newSignUp = function(req, res) {
	createUser(req, res);
}