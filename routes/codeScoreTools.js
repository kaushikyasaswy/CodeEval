var https = require("https");
//var sys = require('sys')
var exec = require('child_process').exec;
var child;

function unzip(filename) {
	/*child = exec("unzip "+filename+" -d ./../uploads/", function (error, stdout, stderr) {
		  sys.print('stdout: ' + stdout);
		  sys.print('stderr: ' + stderr);
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		  console.log(stdout);
		});*/

	child = exec("java -jar ./../checkstyle-6.11.2-all.jar -c /sun_checks.xml -o checkstyle_report.xml -f xml ./../uploads/HW31445012546196", function (error, stdout, stderr) {
		  /*sys.print('stdout: ' + stdout);
		  sys.print('stderr: ' + stderr);*/
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		  console.log(stdout);
		});

	/*child = exec("java ./../jdepend.textui.JDepend -file ./../report.txt ./../uploads/TravelingSalesman", function (error, stdout, stderr) {
		  sys.print('stdout: ' + stdout);
		  sys.print('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
		console.log(stdout);
	});*/

}

function evaluate(filename, res) {
	unzip(filename);
	res.render('success');
}

exports.evaluate = function(req, res){
	evaluate("./../uploads/"+req.query.filename, res);
};