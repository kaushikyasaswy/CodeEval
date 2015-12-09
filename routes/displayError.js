var fs = require("fs");

function getFileErrorDetails(file, callback) {
	var fileContent = fs.readFileSync(file, "utf8");
	console.log(fileContent);
	callback(fileContent);
}

exports.getFileErrorDetails = function(req, res) {
	var username=req.session.username;
	var filename = req.query.filename;
	var lineno = req.query.lineno;
	var error = req.query.error;
	var filepath = './../uploads/' + username + '/' + filename;
	getFileErrorDetails(filepath, function(fileContent) {
		res.render('displayError.ejs', {fileName: filename, lineno: lineno, fileContent: fileContent, error: error});
	});
}