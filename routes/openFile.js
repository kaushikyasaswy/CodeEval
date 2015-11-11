var fs = require("fs");
var colors = require('colors');


//display entire data in file
/*
// Asynchronous - Opening File
fs.readFile('../user_directories/HelloWorld.java', 'utf8', function(err, fd) {
   if (err) {
       return console.error(err);
   }
  console.log(fd);
  console.log("File read successfully!");     
});
 */

//display particular line in file
/*
function get_line(filename, line_no, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    callback(null, lines[+line_no]);
}

get_line('../user_directories/HelloWorld.java', 4, function(err, line){
  console.log('The line: ' + line);
})
 */

//highlighting text in file 
function get_highlighted_line(filename, line_no, callback) {
	var currline = 0;
	var previousLine = "";
	var nextLine = "";
	var errorLine = "";
	var error = 0;
	var flag = 0;
	fs.readFileSync(filename).toString().split('\n').forEach(function (line) { 
		if (++currline == line_no){
			// http://www.codediesel.com/nodejs/adding-colors-to-your-node-js-console/
			errorLine = line;
			error = 1;
		}
		else{
			if (error == 0){
				previousLine = line;
			}
			else {
				nextLine = line;
				if (flag == 0){ 
					flag = 1;
					callback ({'previous': previousLine , 'error' : errorLine, 'next' : nextLine});
				}
			}
		}
	});
}

get_highlighted_line('../user_directories/HelloWorld.java',2, function(result){
	console.log(result);
});