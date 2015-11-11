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