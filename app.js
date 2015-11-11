var express = require('express');
var engine = require('ejs-locals');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var multer = require('multer');
var upload = multer({ dest: './../uploads/'});
var gitPage = require('./routes/gitPage');
var codeScoreTools = require('./routes/codeScoreTools');
var processJDepend = require('./routes/processJDepend');
var processCheckStyle = require('./routes/processCheckStyle');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO get username from cookies
app.use(multer({ dest: './../uploads/'+'anudeep/',
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
        var username = "anudeep";
        var repoName = req.files.fileUpload.originalname;
        repoName = repoName.substring(0, repoName.length - 4);
        codeScoreTools.unzip(username, repoName, function(){
			console.log("final Entry");
			res.redirect('/');
		});
    });
});

app.use('/', routes);
app.post('/gitLogin', gitPage.getAllReposNames);
app.get('/gitRepo', gitPage.getRepo);
app.get('/evaluate', codeScoreTools.evaluate);
app.get('/computeScore', codeScoreTools.checkstyle);
app.get('/jdepend', processJDepend.getResults);
app.get('/checkstyle', processCheckStyle.getResults);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
