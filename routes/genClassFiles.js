var xml2js = require('xml2js');
var path = require('path');
var fs = require('fs');


/**
 * Check if a build.xml exists for the given project
 * @param projectPath
 * @returns absolute path of build.xml if it exists
 */
function isAntExists(projectPath) {
	return search(projectPath, 'build.xml');
}

/**
 * Search for a file name recursively in a directory
 * @param startPath
 * @param keyFileName
 * @returns absolute path of file name if present
 */
function search(startPath, keyFileName) {

	if (!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		return null;
	}

	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		var stat = fs.lstatSync(filename);
		if (stat.isDirectory()) {
			search(filename, keyFileName); // recurse
		} else if (files[i] === keyFileName) {
			console.log('Found: ', files[i]);
			return files[i];
		}
	}
	return false;
}

// isAntExists('/Users/shashank/Downloads/AntDateUtils');

function generateClassFiles(projectPath) {
	// check if ant exists
	if(isAntExists(projectPath)) {
		addJDependAntTask(antFilePath);
		// run ant
		var exec = require('child_process').exec;
		// get build directory
	}
}

// function getBuildDirectory(antFilePath) {
// var extractedData = "";
// // var xml = fs.readFileSync(antFilePath);
// var xml = "<config><test>Hello</test><test
// myattr='myval'>AnotherHello</test><data>SomeData</data></config>";
// var parser = new xml2js.Parser();
// parser.parseString(xml, function(err,result){
// //Extract the value from the data element
// extractedData = result['config']['test'];
// console.log(extractedData);
// });
// }


function addJDependAntTask(antFilePath) {
	var xpath = require('xpath'), dom = require('xmldom').DOMParser;
	var xml = fs.readFileSync(antFilePath);
	var targetAntTask = "<target name=\"jdepend\">\n<jdepend outputfile=\"jdepend-report.txt\">\n<exclude name=\"java.*\"/>\n<exclude name=\"javax.*\"/>\n<classespath>\n<pathelement location=\"{build.dir}\" />\n</classespath>\n<classpath location=\"{build.dir}\" />\n</jdepend>\n</target>\n</project>";
	console.log("Parsing build.xml...");
	var doc = new dom().parseFromString(xml);
	var destdir = xpath.select1("//target/javac/@destdir", doc).value;
	console.log(destdir);
	if (!destdir) {
		throw "No destination directory for class files found in build.xml";
	}
	targetAntTask = targetAntTask.replace(new RegExp("{build.dir}", 'g'),
			destdir);
	xml = xml.replace("</project>", targetAntTask);
	fs.writeFile(antFilePath, xml, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("Added an ant task for jDepend");
	}); 
}
// getBuildDirectory('dfds');


