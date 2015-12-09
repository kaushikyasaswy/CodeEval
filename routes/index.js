var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
	var username = req.session.username;
	var userDirectory = './../uploads/'+username+'/';
	var projects = getUserProjectsFromFolder(userDirectory);
	res.render('index', { title: 'CIS 573 Project', projects: projects });
});

router.get('/homepage', function(req, res) {
	res.render('homePage', { message: null });
});

router.get('/register', function(req, res) {
	res.render('registerPage', { message: null });
});

router.get('/gitLogin', function(req, res) {
	res.render('gitPage', { username: null });
});

function getUserProjectsFromFolder(userDirectory) {
	var projects = [];
	fs.readdirSync(userDirectory).forEach(function(file){
		file = userDirectory + file;
		var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
        	var nameArr = file.split("/");
        	var projectName = nameArr[nameArr.length - 1];
        	projects.push(projectName);
        } 
	});
	return projects;
}

module.exports = router;
