var parsedCheckStyle = require('../configurations/CheckStyle.json');
var checkStyleKeys = Object.keys(parsedCheckStyle);
var parsedJDepend = require('../configurations/JDepend.json');
var jDependKeys = Object.keys(parsedJDepend);
var processCheckStyle = require('./processCheckStyle');
var processJDepend = require('./processJDepend');
var parsedTestFile = require('../configurations/TestFile.json');
var codeScoreTools = require('./codeScoreTools');
var cRunner = require('./genClassFiles');
var checkStyleSum = 0;
var jDependSum = 0;
var checkStyleDenom = 0;
var jDependDenom = 0;
function fetchCheckStyle(jDependFile, checkStyleFile, projectPath, callback) {
	console.log("Entererd fetch json");
	processCheckStyle.getCheckStyleResults(checkStyleFile, function(fileErrors, numOfErrors){
		cRunner.commandRunner("./../javancss-32.53/bin/javancss -ncss -recursive "+projectPath, function(stdout) {
			var ncss = stdout.split("Java NCSS:")[1];
			for(var key in numOfErrors){
				if(checkStyleKeys.indexOf(key) >= 0){
					checkStyleSum += ((numOfErrors[key]/ ncss)*100) * parsedCheckStyle[key];
					checkStyleDenom +=  parsedCheckStyle[key]*100;
				}
			}
			callback(checkStyleSum, checkStyleDenom);
		});
	});
}

function fetchJDepend(jDependFile, checkStyleFile, projectPath, callback) {
		processJDepend.jDependResults(jDependFile, function(json){
			console.log("JDEPEND:" + JSON.stringify(json));
			cRunner.commandRunner("./../javancss-32.53/bin/javancss -ncss -recursive "+projectPath, function(stdout) {
				var ncss = stdout.split("Java NCSS:")[1];
				for(var pkg in json){
					// console.log(json[pkg]);
					for(var key in json[pkg]){
						if(jDependKeys.indexOf(key) >= 0 ){
							jDependSum += parsedJDepend[key] * ((parseInt(json[pkg][key],10)/ncss)*100);
							jDependDenom += parsedJDepend[key]*100;
						}		
					}
				}
				callback(jDependSum, jDependDenom);
			});
		});
}


exports.fetchJSON = function(jDependFile, checkStyleFile, projectPath, res) {
	console.log("Project path:" + projectPath);
	console.log("jDepend File:" + jDependFile);
	console.log("parsed JDepend:"+ JSON.stringify(parsedJDepend));
	console.log("parsed checkstyle: "+ JSON.stringify(parsedCheckStyle));
	fetchCheckStyle(jDependFile, checkStyleFile, projectPath, function(checkStyleSum, checkStyleDenom) {
		checkStyleSum = (checkStyleSum / checkStyleDenom);
		console.log("checkStyleSum:" + checkStyleSum);
		fetchJDepend(jDependFile, checkStyleFile, projectPath, function(jDependSum, jDependDenom) {
			jDependSum = (jDependSum / jDependDenom).toPrecision(3);
			console.log("jDependSum:" + jDependSum);
			var projectName = checkStyleFile.substring(0, checkStyleFile.length-22);
			var projectArr = projectName.split("/");
			projectName = projectArr[projectArr.length - 1];
			var codeScore = (2 - checkStyleSum - jDependSum) * 50;
			res.render('displayScore', {projectName: projectName, checkStyleScore: 100 - parseFloat(checkStyleSum * 100).toFixed(2), jDependScore: 100 - parseFloat(jDependSum * 100).toFixed(2), codeScore: parseFloat(codeScore).toFixed(2)});
		});
	});
};

exports.updateWeights = function(req, res) {
	parsedJDepend["ca"] = parseInt(req.body.ca);
	parsedJDepend["ce"] = parseInt(req.body.ce);
	parsedJDepend["a"] = parseInt(req.body.a);
	parsedJDepend["i"] = parseInt(req.body.i);
	parsedJDepend["d"] = parseInt(req.body.d);
	parsedCheckStyle["AbbrevationAsWordInNameCheck"] = parseInt(req.body.AbbrevationAsWordInNameCheck);
	parsedCheckStyle["ArrayTypeStyleCheck"] = parseInt(req.body.ArrayTypeStyleCheck);
	parsedCheckStyle["CyclomaticComplexityCheck"] = parseInt(req.body.CyclomaticComplexityCheck);
	parsedCheckStyle["WhitespaceAroundCheck"] = parseInt(req.body.WhitespaceAroundCheck);
	parsedCheckStyle["MethodLengthCheck"] = parseInt(req.body.MethodLengthCheck);
	parsedCheckStyle["JavadocMethodCheck"] = parseInt(req.body.JavadocMethodCheck);
	parsedCheckStyle["IndentationCheck"] = parseInt(req.body.IndentationCheck);
	req.query = {filename: req.body.fileName};
	console.log(req.body);
	console.log(req.query.filename);
	codeScoreTools.checkstyle(req,res);
};


//var json = {
//	"java.awt" : {"Ca" : 0 , "Ce" : 1, "A" : 0.2},
//	"java.io" : {"Ca" : 0 , "Ce" : 2, "A" : 1}
//};
// var parsedTestFile = require(json);


