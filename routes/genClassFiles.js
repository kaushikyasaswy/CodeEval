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
			return filename;
		}
	}
	return null;
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
	var child = exec(cmd, function (error, stdout, stderr) {
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }
		  console.log(stdout);
		  callback(stdout);
		});
}

function addJDependAntTask(antFilePath) {
	var xpath = require('xpath'), dom = require('xmldom').DOMParser;
	var xml = fs.readFileSync(antFilePath).toString();
	var targetAntTask = "<target name=\"jdepend\">\n<jdepend outputfile=\"jdepend-report.txt\">\n<exclude name=\"java.*\"/>\n<exclude name=\"javax.*\"/>\n<classespath>\n<pathelement location=\"{build.dir}\" />\n</classespath>\n<classpath location=\"{build.dir}\" />\n</jdepend>\n</target>\n</project>";
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


function generateClassFiles(projectPath, res) {
	// check if ant exists
	var antFilePath = isAntExists(projectPath);
	console.log("Ant path: "+antFilePath);
	if (antFilePath) {
		addJDependAntTask(antFilePath);
		// run ant
		// TODO: Handle errors during ANT
		var runAnt = runCommand('ant -f '+antFilePath, function(stdout) {
			console.log('ant: \n' + stdout);
			// TODO: Handle errors during build
			var runJdepend = runCommand('ant -f '+ antFilePath +' jdepend', function(stdout){
				console.log('\njDepend: \n' + stdout);
			});
		});
	}
}

exports.generateClassFiles = function(req, res) {
	generateClassFiles(req.query.projectPath, res);
}
