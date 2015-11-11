var https = require("https");
//var sys = require('sys')
var fs = require('fs');
var exec = require('child_process').exec;
var genClassFiles = require('./genClassFiles');
var child;

function unzip(username, filename, callback) {
	if (!fs.existsSync("./../uploads/"+username+"/"+filename)) { 
		child = exec("unzip "+"./../uploads/"+username+"/"+filename+".zip"+" -d ./../uploads/"+username+"/"+filename, function (error, stdout, stderr) {
			  if (error !== null) {
			    console.log('exec error: ' + error);
			  }
			  console.log("calling callback");
			  callback();
			});
	}
	else {
		child = exec("rm -rf "+"./../uploads/"+username+"/"+filename, function (error, stdout, stderr) {
			child1 = exec("unzip "+"./../uploads/"+username+"/"+filename+".zip"+" -d ./../uploads/"+username+"/"+filename, function (error, stdout, stderr) {
				  if (error !== null) {
				    console.log('exec error: ' + error);
				  }
				  console.log("calling callback");
				  callback();
				});
		});
		
	}
}


function runCheckstyle(username, filename, res) {
	child = exec("java -jar ./../checkstyle-6.11.2-all.jar -c /sun_checks.xml -o ./../uploads/"+username+"/"+filename+"_checkstyle_report.xml -f xml ./../uploads/"+username+"/"+filename, function (error, stdout, stderr) {
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		  genClassFiles.generateClassFiles(username, "./../uploads/"+username+"/"+filename, res);
		});
}

	/*child = exec("java ./../jdepend.textui.JDepend -file ./../report.txt ./../uploads/TravelingSalesman", function (error, stdout, stderr) {
		  sys.print('stdout: ' + stdout);
		  sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		console.log(stdout);
	});*/


function evaluate(filename, res) {
	unzip(filename);
	res.render('success');
}

exports.unzip = function(username, filename, callback){
	unzip(username, filename, callback);
};

exports.checkstyle = function(req, res){
	var username = "anudeep";
	var filename = req.query.filename;
	runCheckstyle(username, filename, res);
};

exports.evaluate = function(req, res){
	evaluate("./../uploads/"+req.query.filename, res);
};