var mysql = require('mysql');
var session = require('client-sessions');
var config = require('./../configurations/config');
var fs = require('fs');

//Connection data
var connection_data = {
host     : config.db_host,
user     : config.db_user,
password : config.db_password,
database : config.db_database
};

function verify(req, res, code) {
	//Get username from the login session
	var username = req.session.username;
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[signUpVerification.js] : Error connecting to database : ' + err.stack);
			res.render('error.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Login where username='" + username + "'", function(err, rows, fields) {
			if (!err) {
				var code_from_db = rows[0].verificationcode;
				var username = rows[0].username;
				if (code == code_from_db) {
					connection.query("update Login set isVerified='true' where username='" + username + "'", function(err, rows, fields) {
						if (err) {
							console.log(err);
							res.render('signUpVerification.ejs', {message: 'something went wrong'});
							return;
						}
						else {
							req.session.username = username;
							//TODO
							fs.mkdirSync("./../uploads/"+username);
							res.redirect('dashboard');
							return;
						}
					});
				}
				else {
					res.render('signUpVerification.ejs', {message: 'wrong code'});
					return;
				}
			}
			else {
				res.render('signUpVerification.ejs', {message: 'something went wrong'});
				return;
			}
		});
		connection.release();
	});
}


exports.verify = function(req, res){
	verify(req, res, req.body.code);
};