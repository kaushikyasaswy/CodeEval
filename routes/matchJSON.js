var parsedCheckStyle = require('../configurations/CheckStyle.json');
var checkStyleKeys = Object.keys(parsedCheckStyle);
var parsedJDepend = require('../configurations/JDepend.json');
var jDependKeys = Object.keys(parsedJDepend);
var processCheckStyle = require('./processCheckStyle');
var processJDepend = require('./processJDepend');

var parsedTestFile = require('../configurations/TestFile.json');

var checkStyleSum = 0;
var jDependSum = 0;

function fetchJson(jDependFile, checkStyleFile, res) {
	console.log("Entererd fetch json");
	processCheckStyle.getCheckStyleResults(checkStyleFile, function(fileErrors, numOfErrors){
		for(var key in numOfErrors){
			if(checkStyleKeys.indexOf(key) >= 0){
				checkStyleSum += numOfErrors[key] * parsedCheckStyle[key];
			}
		}
		console.log("checkStyleSum:" + checkStyleSum);
		processJDepend.jDependResults(jDependFile, function(json){
			for(var pkg in json){
				console.log(json[pkg]);
				for(var key in json[pkg]){
					if(jDependKeys.indexOf(key) >= 0 ){
						jDependSum += parsedJDepend[key] + parseInt(json[pkg][key],10);
					}
				}
			}
			var projectName = checkStyleFile.substring(0, checkStyleFile.length-22);
			var projectArr = projectName.split("/");
			projectName = projectArr[projectArr.length - 1];
			var codeScore = checkStyleSum + jDependSum;
			console.log("jDependSum:" + jDependSum);
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


