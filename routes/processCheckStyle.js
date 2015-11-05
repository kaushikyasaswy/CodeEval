var fs = require("fs");
var parseString = require("xml2js").parseString;

function processCheckStyle(file, callback) {
	fs.readFile(file, 'utf8', function(err, data) {
		if (err) throw err;
		var files = [];
		parseString(data, function (err, result) {
		    files = result.checkstyle.file;		 
		});
		var fileErrors = {};
		var numOfErrors = {};
		files.forEach(function(file) {
			var errors = [];
			file.error.forEach(function(error) {
				errors.push(error['$']);
				var splitArr = error['$'].source.split(".");
				var source = splitArr[splitArr.length-1];
				if (source in numOfErrors) {
					numOfErrors[source] = numOfErrors[source] + 1;
				}
				else {
					numOfErrors[source] = 1;
				}
			});
			var fileName = file['$'].name;
			fileErrors[fileName] = errors;
		});
		callback(fileErrors, numOfErrors);
	});
};

exports.getResults = function(req, res) {
	file = "./../checkstyle_report.xml";
	processCheckStyle(file, function(fileErrors, numOfErrors) {
		res.render('checkStyleResults.ejs', {fileErrors: fileErrors, numOfErrors: numOfErrors});
	});
}