var mysql = require('mysql');

// Database credential
var con = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database: "state"
});
con.connect();

module.exports = function() { 
    this.sum = function(a,b) { return a+b };
    this.multiply = function(a,b) { return a*b };
    //etc
	this.mute = function(){
		//console.log('Toggle');
		var Mictoggle = require('child_process');
		Mictoggle.exec('amixer -q set Mic toggle', function(error, stdout, stderr) {
		console.log(stdout);});		
		var Mictoggle = require('child_process');
			Mictoggle.exec('amixer -q set Headset toggle', function(error, stdout, stderr) {
			console.log(stdout);});	
	};
	this.checkintent = function (input,input2){
		if(res=='greeting'){
			console.log('TTS: hello there');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "hello there"', function(error, stdout, stderr) {
			console.log(stdout);});	
		}
		if(res=='how are you'){
			console.log('TTS: I am fine thank you');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "I am fine thank you"', function(error, stdout, stderr) {
			console.log(stdout);});	
		}
		if(res=='groot'){
			console.log('TTS: No you are not');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "No you are not"', function(error, stdout, stderr) {
			console.log(stdout);});	
		}
		if(res=='joke'){
			console.log('TTS: a joke hahaha');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "a joke hahaha"', function(error, stdout, stderr) {
			console.log(stdout);});	
			
		}
		if(res=='date'){
			console.log('TTS: Today is ');
			var child_process = require('child_process');
			var d = new Date();
			console.log(d.toString())
			//child_process.exec('google_speech -l en "Today is $(date)"', function(error, stdout, stderr) {
			child_process.exec('google_speech -l en "Today is '+d.toString()+'"', function(error, stdout, stderr) {
			console.log(stdout);});	

		}
		
		if(res=='exit'){
			console.log('TTS: have a nice day');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "have a nice day"', function(error, stdout, stderr) {
			console.log(stdout);});	
			//console.log('Toggle');
			var Mictoggle = require('child_process');
			Mictoggle.exec('amixer -q set Mic toggle', function(error, stdout, stderr) {
			console.log(stdout);});	
			var Mictoggle = require('child_process');
			Mictoggle.exec('amixer -q set Headset toggle', function(error, stdout, stderr) {
			console.log(stdout);});	
			//record.stop()
			process.exit()
		}
		if(res=='appreciation'){
			console.log('TTS: Your Welcome')
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Your Welcome"', function(error, stdout, stderr) {
			console.log(stdout);});	
		}
		if(res=='on light'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			//if(result[0].address==0){
			console.log('TTS: Turning on... ');
			console.log('Light: ON')
			var child_process2 = require('child_process');
			child_process2.exec('sudo python on.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '1' WHERE name IN('light1','light2','light3','light4','light5')";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			//}
			/*if(result[0].address==1){
			console.log('TTS: The light is already on ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}*/
			});
		}
		if(res=='off light'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			//if(result[0].address==1){
			console.log('TTS: Turning off... ');
			console.log('Light: OFF')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python off.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '0' WHERE name IN('light1','light2','light3','light4','light5')";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			//}
			/*if(result[0].address==0){
			console.log('TTS: The light is already off ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}*/
			}); 
		}
		if(res=='light1'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[0].address==0){
			console.log('TTS: Turning on... ');
			console.log('Light 1: ON')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python light1.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '1' WHERE name = 'light1'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[0].address==1){
			console.log('TTS: The light is already on ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='off light1'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[0].address==1){
			console.log('TTS: Turning off... ');
			console.log('Light 1: OFF')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python lighto1.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '0' WHERE name = 'light1'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[0].address==0){
			console.log('TTS: The light is already off ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='light2'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==0){
			console.log('TTS: Turning on... ');
			console.log('Light 2: ON')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python light2.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '1' WHERE name = 'light2'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==1){
			console.log('TTS: The light is already on ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='off light2'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==1){
			console.log('TTS: Turning off... ');
			console.log('Light 2: OFF')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python lighto2.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '0' WHERE name = 'light2'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==0){
			console.log('TTS: The light is already off ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='light3'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==0){
			console.log('TTS: Turning on... ');
			console.log('Light 3: ON')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python light3.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '1' WHERE name = 'light3'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==1){
			console.log('TTS: The light is already on ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='off light3'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==1){
			console.log('TTS: Turning off... ');
			console.log('Light 2: OFF')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python lighto3.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '0' WHERE name = 'light3'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==0){
			console.log('TTS: The light is already off ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='light4'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==0){
			console.log('TTS: Turning on... ');
			console.log('Light 4: ON')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python light4.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '1' WHERE name = 'light4'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==1){
			console.log('TTS: The light is already on ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='off light4'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==1){
			console.log('TTS: Turning off... ');
			console.log('Light 4: OFF')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python lighto4.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '0' WHERE name = 'light4'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==0){
			console.log('TTS: The light is already off ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='light5'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==0){
			console.log('TTS: Turning on... ');
			console.log('Light 5: ON')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python light5.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '1' WHERE name = 'light5'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==1){
			console.log('TTS: The light is already on ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already on"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='off light5'){
			con.query("SELECT * FROM lights", function (err, result, fields) {
			if (err) throw err;
			//console.log(result);
			//console.log(result[0].address);
			if(result[1].address==1){
			console.log('TTS: Turning off... ');
			console.log('Light 5: OFF')
			var child_process2 = require('child_process');
		
			child_process2.exec('sudo python lighto5.py', function(error, stdout, stderr) {
				console.log(stdout);});
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Turning off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			var sql = "UPDATE lights SET address = '0' WHERE name = 'light5'";
			con.query(sql, function (err, result) {
			if (err) throw err;
			//console.log(result.affectedRows + " record(s) updated");
			});
			}
			if(result[1].address==0){
			console.log('TTS: The light is already off ');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "The light is already off"', function(error, stdout, stderr) {
			console.log(stdout);});		
			}
			}); 
		}
		if(res=='dice'){
			var dice = Math.floor(Math.random() * 6) + 1; 
			console.log('TTS: You got '+dice);
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "You got '+dice+'"', function(error, stdout, stderr) {
			console.log(stdout);});		
		}
		if(res=='coin'){
			var coin = Math.floor(Math.random() * 2) + 1;
			if(coin==1){
				console.log('TTS: You got head');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "You got head"', function(error, stdout, stderr) {
				console.log(stdout);});		
			}
			else{
				console.log('TTS: You got tail');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "You got tail"', function(error, stdout, stderr) {
				console.log(stdout);});		
			}
		}
		if(res=='shutdown pi'){
			console.log('TTS: Shutting down');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Shutting down"', function(error, stdout, stderr) {
			console.log(stdout);});		
			mute();
			var shutdown = require('child_process');
			shutdown.exec('sudo poweroff', function(error, stdout, stderr) {
			console.log(stdout);});			
		}
		if(res=='reset pi'){
			console.log('TTS: Restarting');
			var child_process = require('child_process');
			child_process.exec('google_speech -l en "Restarting"', function(error, stdout, stderr) {
			console.log(stdout);});		
			mute();
			var shutdown = require('child_process');
			shutdown.exec('sudo reboot', function(error, stdout, stderr) {
			console.log(stdout);});			
		}
	}
}