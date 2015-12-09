var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');
var signUpVerification = require('./routes/signUpVerification');
var signUp = require('./routes/signUp');
var signIn = require('./routes/signIn');
var routes = require('./routes/index');
var multer = require('multer');
var matchJSON = require('./routes/matchJSON');
var upload = multer({ dest: './../uploads/'});
var gitPage = require('./routes/gitPage');
var codeScoreTools = require('./routes/codeScoreTools');
var processJDepend = require('./routes/processJDepend');
var processCheckStyle = require('./routes/processCheckStyle');
var displayError = require('./routes/displayError');
var fs = require('fs');

var app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	cookieName: 'session',
	secret: 'startmeup',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

var authenticate = function (req, res, next) {
	var isAuthenticated = true;
	if (req.session.name == undefined) {
		isAuthenticated = false;
	}
	if (isAuthenticated) {
		next();
	}
	else {
		res.redirect('/');
	}
}

//TODO get username from cookies -DONE
app.use(multer({ dest: './../uploads/',
	changeDest: function(dest, req, res) {
	    var newDestination = dest + req.session.username + '/';
	    var stat = null;
	    try {
	        stat = fs.statSync(newDestination);
	    } catch (err) {
	        fs.mkdirSync(newDestination);
	    }
	    if (stat && !stat.isDirectory()) {
	        throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
	    }
	    return newDestination
	},
	rename: function (fieldname, filename) {
		return filename;
	},
	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
	}
}));

app.post('/upload',function(req,res){
	upload(req,res,function(err) {
		if(err) {
			return res.end("Error uploading file.");
		}
		//TODO get username from cookies -DONE
		var username = req.session.username;
		var repoName = req.files.fileUpload.originalname;
		repoName = repoName.substring(0, repoName.length - 4);
		console.log("Unzipping... "+ repoName);
		codeScoreTools.unzip(username, repoName, function(){
			res.redirect('/dashboard');
		});
	});
});
app.get('/', function(req, res) {
	res.render('homePage', { message: null });
});

app.use('/', routes);
app.post('/signin', signIn.signin);
app.post('/signup', signUp.newSignUp);
app.post('/signUpVerification', signUpVerification.verify);
app.post('/gitLogin', gitPage.getAllReposNames);
app.get('/gitRepo', gitPage.getRepo);
app.get('/evaluate', codeScoreTools.evaluate);
app.get('/computeScore', codeScoreTools.checkstyle);
app.get('/jdepend', processJDepend.getResults);
app.get('/checkstyle', processCheckStyle.getResults);
app.get('/displayError', displayError.getFileErrorDetails);
app.post('/updateWeights', matchJSON.updateWeights);

//catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//error handlers

//development error handler
//will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;
