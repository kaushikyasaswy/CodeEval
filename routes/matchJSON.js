var parsedCheckStyle = require('../configurations/CheckStyle.json');
var checkStyleKeys = Object.keys(parsedCheckStyle);
var parsedJDepend = require('../configurations/JDepend.json');
var jDependKeys = Object.keys(parsedJDepend);
var processCheckStyle = require('./processCheckStyle');
var processJDepend = require('./processJDepend');
var parsedTestFile = require('../configurations/TestFile.json');
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
			cRunner.commandRunner("./../javancss-32.53/bin/javancss -ncss -recursive "+projectPath, function(stdout) {
				var ncss = stdout.split("Java NCSS:")[1];
				for(var pkg in json){
					console.log(json[pkg]);
					for(var key in json[pkg]){
						if(jDependKeys.indexOf(key) >= 0 ){
							jDependSum += parsedJDepend[key] + ((parseInt(json[pkg][key],10)/ncss)*100);
							jDependDenom += parsedJDepend[key]*100;
						}		
					}
				}
				callback(jDependSum, jDependDenom);
			});
		});
}


exports.fetchJSON = function(jDependFile, checkStyleFile, projectPath, res) {
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
			res.render('displayScore', {projectName: projectName, checkStyleScore: parseFloat(checkStyleSum * 100).toFixed(2), jDependScore: parseFloat(jDependSum * 100).toFixed(2), codeScore: parseFloat(codeScore).toFixed(2)});
		});
	});
};


//var json = {
//	"java.awt" : {"Ca" : 0 , "Ce" : 1, "A" : 0.2},
//	"java.io" : {"Ca" : 0 , "Ce" : 2, "A" : 1}
//};
// var parsedTestFile = require(json);


