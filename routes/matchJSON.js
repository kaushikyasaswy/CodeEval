var parsedCheckStyle = require('../configurations/CheckStyle.json');
var checkStyleKeys = Object.keys(parsedCheckStyle);
var parsedJDepend = require('../configurations/JDepend.json');
var jDependKeys = Object.keys(parsedJDepend);
var processCheckStyle = require('./processCheckstyle');
var processJDepend = require('./processJDepend');
var parsedTestFile = require('../configurations/TestFile.json');
var cRunner = require('./genClassFiles');
var checkStyleSum = 0;
var jDependSum = 0;
var checkStyleDenom = 0;
var jDependDenom = 0;
function fetchJson(jDependFile, checkStyleFile, projectPath, ) {
	console.log("Entererd fetch json");
	processCheckStyle.getCheckStyleResults(checkStyleFile, function(fileErrors, numOfErrors){
		for(var key in numOfErrors){
			if(checkStyleKeys.indexOf(key) >= 0){
				// TODO: normalize code score
				
				// get the number of non-commented lines of code
				cRunner.commandRunner("./../javancss-32.53/bin/javancss -ncss -recursive "+projectPath, function(stdout) {
					var ncss = stdout.split("Java NCSS:")[1];
					console.log("scaled errors: "+ numOfErrors[key]/ ncss);
					checkStyleSum += ((numOfErrors[key]/ ncss)*100) * parsedCheckStyle[key];
					checkStyleDenom +=  parsedCheckStyle[key]*100;
				});
			}
		}
		checkStyleSum = checkStyleSum / checkStyleDenom;
		console.log("checkStyleSum:" + checkStyleSum);
		processJDepend.jDependResults(jDependFile, function(json){
			for(var pkg in json){
				console.log(json[pkg]);
				for(var key in json[pkg]){
					if(jDependKeys.indexOf(key) >= 0 ){
						// TODO: Normalize code score
						// get the number of non-commented lines of code
						cRunner.commandRunner("./../javancss-32.53/bin/javancss -ncss -recursive "+projectPath, function(stdout) {
							var ncss = stdout.split("Java NCSS:")[1];
							jDependSum += parsedJDepend[key] + ((parseInt(json[pkg][key],10)/ncss)*100);
							jDependDenom += parsedJDepend[key]*100;
						});
						
					}
				}
			}
			jDependSum = jDependSum / jDependDenom;
			console.log("jDependSum:" + jDependSum);
			var projectName = checkStyleFile.substring(0, checkStyleFile.length-22);
			var projectArr = projectName.split("/");
			projectName = projectArr[projectArr.length - 1];
			// TODO: (2 - codeScore) * 100
			var codeScore = (2 - checkStyleSum - jDependSum) * 100;
			res.render('displayScore', {projectName: projectName, checkStyleScore: checkStyleSum, jDependScore: jDependSum, codeScore: codeScore});
		});

	});
}


exports.fetchJSON = function(jDependFile, checkStyleFile, res) {
	fetchJson(jDependFile, checkStyleFile, res);
};


//var json = {
//	"java.awt" : {"Ca" : 0 , "Ce" : 1, "A" : 0.2},
//	"java.io" : {"Ca" : 0 , "Ce" : 2, "A" : 1}
//};
// var parsedTestFile = require(json);


