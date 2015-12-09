var fs = require("fs");

function processJDepend(file, callback) {
	fs.readFile(file, 'utf8', function(err, data) {
		jDependResults = [];
		if (err) throw err;
		var lines = data.split(/\r?\n/);
		var flag = false;
		var counter = 0;
		lines.forEach(function(line) {
			if (flag === true && line.trim() != "") {
				var splits = line.split(",");
				result = {};
				result['name'] = splits[0];
				result['class_count'] = splits[1];
				result['abs_class_count'] = splits[2];
				result['ca'] = splits[3];
				result['ce'] = splits[4];
				result['a'] = splits[5];
				result['i'] = splits[6];
				result['d'] = splits[7];
				result['v'] = splits[8];
				jDependResults.push(result);
			}
			if (line.indexOf("Name, Class Count, Abstract Class Count, Ca, Ce, A, I, D, V:") > -1) {
				flag = true;
			}
		});
		callback(jDependResults);
	});
};

exports.getResults = function(req, res) {
	var userName=req.session.username;
	var projectName = req.query.fileName;
	var jDependFile = "./../uploads/"+userName+"/" + projectName +"_jdepend_report.txt";
	jDependResults = processJDepend(jDependFile, function(results) {
		res.render('jDependResults.ejs', {projectName: projectName, results: results});
	});
}

exports.jDependResults = function(jDependFile, callback) {
		jDependResults = processJDepend(jDependFile, callback);
		//callback({results: results});
	//});
}