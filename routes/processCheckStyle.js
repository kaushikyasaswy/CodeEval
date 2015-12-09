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
		var errorsToFiles = {};
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
				
				if (source in errorsToFiles) {
					var fileList = errorsToFiles[source];
					if (file in fileList) {
						
					} else {
						fileList.push(file['$'].name.split('../uploads/')[1].split(/\/(.+)?/)[1]);
						errorsToFiles[source] = fileList;
					}
					
				} else {
					errorsToFiles[source] = [file['$'].name.split('../uploads/')[1].split(/\/(.+)?/)[1]]; 
				}
				
			});
			var fileName = file['$'].name.split('../uploads/')[1].split(/\/(.+)?/)[1];
			fileErrors[fileName] = errors;
			// console.log(errorsToFiles);
		});
		callback(fileErrors, numOfErrors, errorsToFiles);
	});
};

exports.getResults = function(req, res) {
	var userName=req.session.username;
	var projectName = req.query.fileName;
	var checkStyleFile = "./../uploads/"+userName+"/" + projectName +"_checkstyle_report.xml";
	processCheckStyle(checkStyleFile, function(fileErrors, numOfErrors, errorsToFiles) {
		res.render('checkStyleResults.ejs', {projectName: projectName, fileErrors: fileErrors, numOfErrors: numOfErrors, errorsToFiles: errorsToFiles});
	});
}

exports.getCheckStyleResults = function(checkStyleFile, callback) {
	// file = "./../checkstyle_report.xml";
	processCheckStyle(checkStyleFile, callback);
		// callback({fileErrors: fileErrors, numOfErrors: numOfErrors});
	//});
}
