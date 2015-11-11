var parsedCheckStyle = require('../configurations/CheckStyle.json');
var checkStyleKeys = Object.keys(parsedCheckStyle);

var parsedTestFile = require('../configurations/TestFile.json');

var sum = 0;

for(var key in parsedTestFile){
	if(checkStyleKeys.indexOf(key) >= 0){
		sum += parsedTestFile[key] * parsedCheckStyle[key];
	}
}

console.log(sum);


var parsedJDepend = require('../configurations/JDepend.json');
var jDependKeys = Object.keys(parsedJDepend);
var json = {
	"java.awt" : {"Ca" : 0 , "Ce" : 1, "A" : 0.2},
	"java.io" : {"Ca" : 0 , "Ce" : 2, "A" : 1}
};
// var parsedTestFile = require(json);

var new_sum = 0;

for(var pkg in json){
	// console.log(json[pkg]);
	for(var key in json[pkg]){
		if(jDependKeys.indexOf(key) >= 0 ){
			new_sum += parsedJDepend[key] + json[pkg][key];
		}
	}
}

console.log(new_sum);