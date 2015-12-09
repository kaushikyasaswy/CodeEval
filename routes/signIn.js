var mysql = require('mysql');
var session = require('client-sessions');
var config = require('./../configurations/config');

//Connection data
var connection_data = {
host     : config.db_host,
user     : config.db_user,
password : config.db_password,
database : config.db_database
};

//Function to authenticate the email and password provided by the user
function authenticate(req, res, username, password) {
	var connection_pool = mysql.createPool(connection_data);
	connection_pool.getConnection(function(err, connection) {
		if (err) {
			console.error('[Authentication.js] : Error connecting to database : ' + err.stack);
			res.render('error.ejs', {message: 'unable to connect to database at this time'});
			return;
		}
		connection.query("select * from Login where username='" + username + "'", function(err, rows, fields) {
			if (!err) {
				if (rows.length == 0) {
					res.render('homePage.ejs', {message: 'username does not exist'});
					return;
				}
				var password_from_db = rows[0].password;
				var verified = rows[0].isVerified;
				if (password == password_from_db) {
					req.session.username = username;
					if (verified == 'true') {
						connection.query("select * from Student where username='" + username + "'", function(err, rows, fields) {
							req.session.gitid = rows[0].githubid;
							res.redirect('dashboard');
							return;
						});
					}
					else {
						res.render('signUpVerificationPage.ejs', {message: 'verification pending'});
						return;
					}
				}
				else {
					res.render('homePage.ejs', {message: 'wrong password'});
					return;
				}
			}
			else {
				console.error('[Authentication.js] : Error querying Customers table : ' + err.stack);
				res.render('error.ejs', {message: 'Unable to query database at this time'});
				return;
			}
		});
		connection.release();
	});
}

exports.signin = function(req, res){
	authenticate(req, res, req.body.username, req.body.password); //Variables for email and password field from UI
};