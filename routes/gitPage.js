var https = require("https");
var fs = require("fs");
var AdmZip = require("adm-zip");
var request = require("request");
var http = require("http");
var ZipEntry = require('adm-zip/zipEntry');
var codeScoreTools = require('./codeScoreTools');

function fetchRepositories(username, res) {
	var options = {
			host :"api.github.com",
			path : '/users/'+username+'/repos',
			method : 'GET',
			headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
	}
	var request = https.request(options, function(response){
		var body = '';
		response.on('data',function(chunk){
			body+=chunk;
		});
		response.on('end',function(){
			var json = JSON.parse(body);
			var repos =[];
			json.forEach(function(repo){
				repos.push(repo.name);
			});
			res.json({ username: username, repos: repos });
		});
	});
	request.on('error', function(e) {
		console.error('and the error is '+e);
	});
	request.end();
};

/*function fetchRepoAndSave(username, repoName, res) {
	var out = fs.createWriteStream('./../uploads/'+username+'---'+repoName+'.zip');
	var request = https.request({
		host :"api.github.com",
		path : '/repos/'+username+'/'+repoName+'/zipball/master',
		method : 'GET',
		headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
	});
	request.pipe(out);
	request.on('end', function() {
	    var zip = new AdmZip('./../uploads/'+username+'---'+repoName+'.zip'),
	    zipEntries = zip.getEntries();
	    zip.extractAllTo("./../newuploads/", true);
	});
	res.render('success');
	request.end();
};*/

/*function fetchRepoAndSave(username, repoName, res) {
	var out = fs.createWriteStream('./../uploads/'+username+'---'+repoName+'.zip');
	var options = {
			host :"api.github.com",
			path : '/repos/'+username+'/'+repoName+'/zipball/master',
			method : 'GET',
			headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}	
	};
	var request = https.request(options, function(response) {
		response.on('data', function (data) {
			if (data != undefined) {
				console.log(data);
			}
			fs.appendFileSync(out, data);
		});
		response.on('end', function() {
			var zip = new AdmZip(out);
			//zip.extractAllTo("./../newuploads/");
			//fs.unlink('./../uploads/'+username+'---'+repoName+'.zip');
		})
	});
	request.end();
	res.render('success');
};*/

/*function fetchRepoAndSave(username, repoName, res) {
	var out = './../uploads/'+username+'---'+repoName+'.zip';
	var options = {
			host :'api.github.com',
			path : '/repos/'+username+'/'+repoName+'/zipball/master',
			method : 'GET',
			headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'}
	};
	https.request(options)
	.pipe(fs.createWriteStream(out))
	.on('close', function () {
		console.log('File written!');
	});
	res.render('success');
};*/

function fetchRepoAndSave(username, repoName, response) {
	var options = {
			url : 'https://api.github.com/repos/'+username+'/'+repoName+'/zipball/master',
			host :'api.github.com',
			path : '/repos/'+username+'/'+repoName+'/zipball/master',
			method : 'GET',
			headers: {'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'},
			encoding: null
	};
	request.get(options, function(err, res, zipFile) {
		var dest = './../uploads/'+username+'/'+repoName+'.zip';
		fs.writeFile(dest, zipFile, function() {
			codeScoreTools.unzip(username, repoName, function(){
				console.log("final Entry");
				response.redirect('/');
			});
			
		});
		
    });
};

exports.getAllReposNames = function(req, res){
	fetchRepositories(req.body.username, res);
};

exports.getRepo = function(req, res) {
	fetchRepoAndSave(req.query.username, req.query.repo, res);
}