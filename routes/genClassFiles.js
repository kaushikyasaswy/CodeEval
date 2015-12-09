var xml2js = require('xml2js');
var path = require('path');
var fs = require('fs');
var projectPath = "";
var projectName = "";
var matchJSON = require('./matchJSON');

/**
 * Check if a build.xml exists for the given project
 * @param projectPath
 * @returns absolute path of build.xml if it exists
 */
function isAntExists(projectPath, callback) {
	return search(projectPath, 'build.xml', callback);
}

/**
 * Search for a file name recursively in a directory
 * @param startPath
 * @param keyFileName
 * @returns absolute path of file name if present
 */
function search(startPath, keyFileName, callback) {

	if (!fs.existsSync(startPath)) {
		console.log("no dir ", startPath);
		callback(null);
	}

	var files = fs.readdirSync(startPath);
	for (var i = 0; i < files.length; i++) {
		var filename = path.join(startPath, files[i]);
		var stat = fs.lstatSync(filename);
		if (stat.isDirectory()) {
			search(filename, keyFileName, callback); // recurse
		} else if (files[i] === keyFileName) {
			console.log('Found: ', files[i]);
			console.log(filename);
			callback(filename);
		}
	}
	console.log("Build.xml not found");
	//callback(null);
}

/**
 * Spawns the system command. 
 * @param cmd
 * returns Process output
 */
//function runCommand(cmd) {
//	var spawn = require('child_process').spawn;
//	var prc = spawn(cmd);
//	var output = "";
//	//noinspection JSUnresolvedFunction
//	prc.stdout.setEncoding('utf8');
//	prc.stdout.on('data', function(data) {
//		var str = data.toString()
//		var lines = str.split(/(\r?\n)/g);
//		output = lines.join("");
//	});
//
//	prc.on('close', function(code) {
//		output += 'process exit code ' + code;
//	});
//	return output;
//}
function runCommand(cmd, callback) {
	var exec = require('child_process').exec;
	
	var child = exec(cmd, function (error, stdout, stderr ) {
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		  callback(stdout);
		});
	
}

function addJDependAntTask(antFilePath) {
	var xpath = require('xpath'), dom = require('xmldom').DOMParser;
	var xml = fs.readFileSync(antFilePath).toString();
	var targetAntTask = "<target name=\"jdepend\">\n<jdepend outputfile=\""+projectPath+"/../"+projectName+"_jdepend_report.txt\">\n<exclude name=\"java.*\"/>\n<exclude name=\"javax.*\"/>\n<classespath>\n<pathelement location=\"{build.dir}\" />\n</classespath>\n<classpath location=\"{build.dir}\" />\n</jdepend>\n</target>\n</project>";
	console.log(targetAntTask);
	console.log("Parsing build.xml...");
	var doc = new dom().parseFromString(xml);
	var destdir = xpath.select1("//target/javac/@destdir", doc).value;
	if (!destdir) {
		throw "No destination directory for class files found in build.xml";
	}
	targetAntTask = targetAntTask.replace(new RegExp("{build.dir}", 'g'),
			destdir);
	xml = xml.replace("</project>", targetAntTask);
	fs.writeFileSync(antFilePath, xml);
}


function generateClassFiles(userName, projectPath, res) {
	// check if ant exists
	
		search(projectPath, "build.xml", function(antFilePath) {
		console.log(projectPath);
		console.log("Ant path: "+antFilePath);
		if (antFilePath) {
			addJDependAntTask(antFilePath);
			// run ant
			// TODO: Handle errors during ANT
			console.log("Running ant from: ./../apache-ant-1.9.6/bin/ant" );
			var runAnt = runCommand('./../apache-ant-1.9.6/bin/ant -f '+antFilePath, function(stdout) {
				//console.log('ant: \n' + stdout);
				console.log("Generating class files");
				// TODO: Handle errors during build
				var runJdepend = runCommand('./../apache-ant-1.9.6/bin/ant -f '+ antFilePath +' jdepend', function(stdout){
					console.log('\n MY jDepend: \n' + stdout);
					var checkStyleFile = "./../uploads/"+userName+"/" + projectName +"_checkstyle_report.xml";
					var jDependFile = "./../uploads/"+userName+"/" + projectName +"_jdepend_report.txt";
					console.log("Switching control to match json");
					matchJSON.fetchJSON(jDependFile, checkStyleFile, res);
				});
				console.log("Class files have been generated");
			});
		}
	});
	
}

exports.generateClassFiles = function(userName, fileName, res) {
	fileName = fs.realpathSync(fileName);
	projectPath = fileName.trim();
	if(projectPath[projectPath.length - 1] === "/") {
		projectPath = projectPath.substring(0, projectPath.length-1);
	}
	var arr = projectPath.split("/");
	projectName = arr[arr.length - 1];
	generateClassFiles(userName, projectPath, res);
}
