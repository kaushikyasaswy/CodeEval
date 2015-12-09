var fs = require("fs");

function getFileErrorDetails(file, callback) {
	
}

exports.getFileErrorDetails = function(req, res) {
	var username=req.session.username;
	var filename = req.query.fileName;
	var lineno = req.query.lineno;
	var error = req.query.error;
	var filepath = './../uploads/' + username + '/' + filename;
	getFileErrorDetails(filepath, function(fileContent) {
		res.render('displayError.ejs', {filename: filename, lineno: lineno, fileContent: fileContent, error: error});
	});
}