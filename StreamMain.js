console.log('Preparing...');
require('StreamHead.js')();
mute();
const record = require('node-record-lpcm16');

// Google Cloud API Credentials
var gcloud = require('google-cloud')({
  projectId: '',
  credentials: require('keyfile.json'),
  keyFilename: 'keyfile.json'
});

var googleMapsClient = require('@google/maps').createClient({
  key: ''
});

var mysql      = require('mysql');
var con = mysql.createConnection({
  host     : '',
  user     : '',
  password : '',
  database: "state"
});
con.connect();

// Wit.AI Credential
const {Wit, log} = require('node-wit');
const client = new Wit({accessToken: ''});
 
const Speech = require('@google-cloud/speech');
const speech = Speech();
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';
const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode
  },
};

var auth = 0;
var authV = 0;
var setpass = 0;
var newpass = 0;
var setlocation = 0;
 const recognizeStream = speech.createRecognizeStream(request)
  .on('error', console.error)
  //.on('data', (data) => process.stdout.write(data.results+'\n'))
  .on('data', (data) => { 
	mute()
	//process.stdout.write(data.results+'\n\n')
	console.log('STT: '+data.results)
	usrinput = data.results;
	usrinput = usrinput.replace(/^\s+|\s+$/gm,''); //no space
//Bot
	
	if(setpass == 1){
		//console.log(usrinput);
		var sql = "SELECT * FROM authorization";
		con.query(sql, function (err, result) {
			if (err) throw err;
			
			if(newpass == 1){
				console.log('TTS: Your new password is '+usrinput);
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "Your new password is '+usrinput+'"', function(error, stdout, stderr) {
				console.log(stdout);})
				setTimeout(mute, 3000);
				var sql = "UPDATE authorization SET pass = '"+usrinput+"'";
				con.query(sql, function (err, result) {
				if (err) throw err;
				})
				newpass = 0;
				setpass = 0;
			}
			else if(usrinput == result[0].pass || usrinput == ' '+result[0].pass){
					newpass = 1;
					console.log('processing...');
					console.log('TTS: Speak the new password');
					var child_process = require('child_process');
					child_process.exec('google_speech -l en "Speak the new password"', function(error, stdout, stderr) {
					console.log(stdout);})
					setTimeout(mute, 3000);
					
			}
			else{
				setpass = 0;
				console.log('TTS: The password is invalid try again...');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "The password is invalid try again"', function(error, stdout, stderr) {
				console.log(stdout);})
				setTimeout(mute, 3000);
			}
			});
		
	}
	else if(setlocation == 1){
		client.message(data.results, {})
		.then((data) => {
				if(data.entities.location === undefined){
					console.log('TTS: Invalid location');
						var child_process = require('child_process');
						child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
						console.log(stdout);});
						setTimeout(mute, 2000);
						setlocation = 0;
				}
				else{
					//console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
					
					locinput = data.entities.location[0]["value"];
					googleMapsClient.geocode({
					  address: locinput
					}, function(err, response) {
					  if (!err) {
						//console.log(response.json.results);
						//console.log(response.json);
						if(response.json.status=='OK'&&response.json.results.length>0){
							console.log('TTS: Your new location is '+locinput);
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "Your new location is '+locinput+'"', function(error, stdout, stderr) {
							console.log(stdout);})
							setTimeout(mute, 3000);
							var sql = "UPDATE defaultlocation SET location = '"+locinput+"'";
							con.query(sql, function (err, result) {
							if (err) throw err;
							})
							setlocation = 0;
						}
						else{
							console.log('TTS: Invalid location');
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
							console.log(stdout);});
							setTimeout(mute, 2000);
							setlocation = 0;
						}

					  }
					});


				}
		})
	}
	else{
		//Bot
		client.message(data.results, {})
		.then((data) => {
			
			if(data.entities.intent === undefined){
			  console.log('processing...');
			  console.log('TTS: I am not sure what you said');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "I am not sure what you said"', function(error, stdout, stderr) {
				console.log(stdout);});	
				setTimeout(mute, 3000);
			}
			else if(data.entities.intent[0]["value"] == 'setpass'){
				console.log('TTS: Speak the old password');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "Speak the old password"', function(error, stdout, stderr) {
				console.log(stdout);});
				setTimeout(mute, 3000);
				setpass = 1		
				console.log('Set Password Mode');
			}
			else if(data.entities.intent[0]["value"] == 'weather'){
				
				var sql = "SELECT * FROM defaultlocation";
				con.query(sql, function (err, result) {
				
				
				if(data.entities.location === undefined){
					loc = result[0].location;
				}
				else{
					loc= data.entities.location[0]["value"];
				}
				if(loc === undefined){
					console.log('TTS: Invalid location');
					var child_process = require('child_process');
					child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
					console.log(stdout);});
					setTimeout(mute, 2000);
				}
				else{
					var weather = require('openweather-apis');
					weather.setLang('en');
					weather.setAPPID('');
					weather.setCity(loc);
					weather.getAllWeather(function(err, JSONObj){
						if(JSONObj.message == 'city not found'){
							console.log('TTS: Invalid location');
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
							console.log(stdout);});
							setTimeout(mute, 2000);
						}
						else{
							console.log('SST: The weather is '+JSONObj.weather[0]["description"]+' The temperature is '+JSONObj.main.temp+' celsius The pressure is '+JSONObj.main.pressure+' The humidity is '+JSONObj.main.humidity);
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "The weather is '+JSONObj.weather[0]["description"]+' The temperature is '+JSONObj.main.temp+' celsius The pressure is '+JSONObj.main.pressure+' The humidity is '+JSONObj.main.humidity+'"', function(error, stdout, stderr) {
								//mute();
							console.log(stdout);})
							setTimeout(mute, 12000);
						}
					});
					
				}
				})
			}
			else if(data.entities.intent[0]["value"] == 'setlocation'){
				console.log('TTS: Choose the location');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "Choose the location"', function(error, stdout, stderr) {
				console.log(stdout);});
				setTimeout(mute, 3000);
				setlocation = 1		
				console.log('Set location Mode');
			}
			else if(data.entities.intent[0]["value"] == 'alarm'){
					//var sleep = require('sleep');
					var num = data.entities.duration[0]["normalized"]["value"]*1000;
					console.log('Timer: '+data.entities.duration[0]["value"]+' '+data.entities.duration[0]["unit"])
					mute();
					setTimeout(function(){
						mute();
						console.log('TTS: Time Up Time Up');
						var child_process = require('child_process');
						child_process.exec('google_speech -l en "Time Up Time Up"', function(error, stdout, stderr) {
						console.log(stdout);});
						setTimeout(mute,2000);
					},num)
			}
			else if(data.entities.intent[0]["value"] == 'traffic'){
				var distance = require('google-distance');
				distance.apiKey = '';
				
				//console.log(data.entities.location.length);
				if(data.entities.location===undefined){
						console.log('TTS: Invalid location');
						var child_process = require('child_process');
						child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
						console.log(stdout);});
						setTimeout(mute,3000);
				}
				else{
					var locnum = data.entities.location.length;			
					var destinations = data.entities.location[0]["value"];
					var sql = "SELECT * FROM defaultlocation";
					con.query(sql, function (err, result) {
						var origins = result[0].location;
						if(locnum>1){
							var origins = data.entities.location[0]["value"];
							var destinations = data.entities.location[1]["value"];
						}		
						else{
							var destinations = data.entities.location[0]["value"];
						}
						distance.get(
							  {
								origin: origins,
								destination: destinations
							  },
							  function(err, data) {
								if(data == undefined){
									console.log('TTS: Invalid location');
									var child_process = require('child_process');
									child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
									console.log(stdout);});
									setTimeout(mute,3000);
								}
								else{	
									if (err) return console.log(err);
								//	console.log(data.distance);
								//	console.log(data.duration);
									//console.log(data);	
									console.log('TTS:  The distance from '+origins+' to '+destinations+' is '+data.distance+' ETA '+data.duration+' by car');
									var child_process = require('child_process');
									child_process.exec('google_speech -l en "The distance from '+origins+' to '+destinations+' is '+data.distance+' ETA '+data.duration+' by car"', function(error, stdout, stderr) {
									console.log(stdout);});
									setTimeout(mute,10000);
								}
							});
					})
				}
			}
			else{	
			  console.log('processing...');
			  //console.log("Intent: "+data.entities.intent[0]["value"]);
			  res = data.entities.intent[0]["value"];
			  if(data.entities.duration == undefined){
				  checkintent(res,usrinput);
				  setTimeout(mute, 3000);
			  }
			  else{
				  console.log('Timer: '+data.entities.duration[0]["value"]+' '+data.entities.duration[0]["unit"])
				  var num = data.entities.duration[0]["normalized"]["value"]*1000;
				  mute();
				  setTimeout(function(){
					mute();
					checkintent(res,usrinput,num)
					setTimeout(mute, 3000);
				  },num);
				  
			  }
			}
			  //console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
		})
		.catch(console.error);
	}
});

// Start recording and send the microphone input to the Speech API
record.start({
  sampleRateHertz: sampleRateHertz,
  threshold: 0,
  //verbose: true
  verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
	
})
.on('error', console.error)
.pipe(recognizeStream);

// LOOP******************************************

setInterval(function(){
   record.stop(),
   mute();
   console.log('Please Wait...');


	const recognizeStream = speech.createRecognizeStream(request)
	  .on('error', console.error)
	  //.on('data', (data) => process.stdout.write(data.results+'\n'))
	  .on('data', (data) => { 
		mute()
		//process.stdout.write(data.results+'\n\n')
		console.log('STT: '+data.results)
		usrinput = data.results;
		usrinput = usrinput.replace(/^\s+|\s+$/gm,''); //no space
	//Bot
		
		if(setpass == 1){
		//console.log(usrinput);
		var sql = "SELECT * FROM authorization";
		con.query(sql, function (err, result) {
			if (err) throw err;
			
			if(newpass == 1){
				console.log('TTS: Your new password is '+usrinput);
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "Your new password is '+usrinput+'"', function(error, stdout, stderr) {
				console.log(stdout);})
				setTimeout(mute, 3000);
				var sql = "UPDATE authorization SET pass = '"+usrinput+"'";
				con.query(sql, function (err, result) {
				if (err) throw err;
				})
				newpass = 0;
				setpass = 0;
			}
			else if(usrinput == result[0].pass || usrinput == ' '+result[0].pass){
					newpass = 1;
					console.log('processing...');
					console.log('TTS: Speak the new password');
					var child_process = require('child_process');
					child_process.exec('google_speech -l en "Speak the new password"', function(error, stdout, stderr) {
					console.log(stdout);})
					setTimeout(mute, 3000);
					
			}
			else{
				setpass = 0;
				console.log('TTS: The password is invalid try again...');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "The password is invalid try again"', function(error, stdout, stderr) {
				console.log(stdout);})
				setTimeout(mute, 3000);
			}
			});
		
	}
	else if(setlocation == 1){
		client.message(data.results, {})
		.then((data) => {
				if(data.entities.location === undefined){
					console.log('TTS: Invalid location');
						var child_process = require('child_process');
						child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
						console.log(stdout);});
						setTimeout(mute, 2000);
						setlocation = 0;
				}
				else{
					//console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
					
					locinput = data.entities.location[0]["value"];
					googleMapsClient.geocode({
					  address: locinput
					}, function(err, response) {
					  if (!err) {
						//console.log(response.json.results);
						//console.log(response.json);
						if(response.json.status=='OK'&&response.json.results.length>0){
							console.log('TTS: Your new location is '+locinput);
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "Your new location is '+locinput+'"', function(error, stdout, stderr) {
							console.log(stdout);})
							setTimeout(mute, 3000);
							var sql = "UPDATE defaultlocation SET location = '"+locinput+"'";
							con.query(sql, function (err, result) {
							if (err) throw err;
							})
							setlocation = 0;
						}
						else{
							console.log('TTS: Invalid location');
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
							console.log(stdout);});
							setTimeout(mute, 2000);
							setlocation = 0;
						}

					  }
					});


				}
		})
	}
	else{
		//Bot
		client.message(data.results, {})
		.then((data) => {
			
			if(data.entities.intent === undefined){
			  console.log('processing...');
			  console.log('TTS: I am not sure what you said');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "I am not sure what you said"', function(error, stdout, stderr) {
				console.log(stdout);});	
				setTimeout(mute, 3000);
			}
			else if(data.entities.intent[0]["value"] == 'setpass'){
				console.log('TTS: Speak the old password');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "Speak the old password"', function(error, stdout, stderr) {
				console.log(stdout);});
				setTimeout(mute, 3000);
				setpass = 1		
				console.log('Set Password Mode');
			}
			else if(data.entities.intent[0]["value"] == 'weather'){
				
				var sql = "SELECT * FROM defaultlocation";
				con.query(sql, function (err, result) {
				
				
				if(data.entities.location === undefined){
					loc = result[0].location;
				}
				else{
					loc= data.entities.location[0]["value"];
				}
				if(loc === undefined){
					console.log('TTS: Invalid location');
					var child_process = require('child_process');
					child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
					console.log(stdout);});
					setTimeout(mute, 2000);
				}
				else{
					var weather = require('openweather-apis');
					weather.setLang('en');
					weather.setAPPID('');
					weather.setCity(loc);
					weather.getAllWeather(function(err, JSONObj){
						if(JSONObj.message == 'city not found'){
							console.log('TTS: Invalid location');
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
							console.log(stdout);});
							setTimeout(mute, 2000);
						}
						else{
							console.log('SST: The weather is '+JSONObj.weather[0]["description"]+' The temperature is '+JSONObj.main.temp+' celsius The pressure is '+JSONObj.main.pressure+' The humidity is '+JSONObj.main.humidity);
							var child_process = require('child_process');
							child_process.exec('google_speech -l en "The weather is '+JSONObj.weather[0]["description"]+' The temperature is '+JSONObj.main.temp+' celsius The pressure is '+JSONObj.main.pressure+' The humidity is '+JSONObj.main.humidity+'"', function(error, stdout, stderr) {
								//mute();
							console.log(stdout);})
							setTimeout(mute, 12000);
						}
					});
					
				}
				})
			}
			else if(data.entities.intent[0]["value"] == 'setlocation'){
				console.log('TTS: Choose the location');
				var child_process = require('child_process');
				child_process.exec('google_speech -l en "Choose the location"', function(error, stdout, stderr) {
				console.log(stdout);});
				setTimeout(mute, 3000);
				setlocation = 1		
				console.log('Set location Mode');
			}
			else if(data.entities.intent[0]["value"] == 'alarm'){
					//var sleep = require('sleep');
					var num = data.entities.duration[0]["normalized"]["value"]*1000;
					console.log('Timer: '+data.entities.duration[0]["value"]+' '+data.entities.duration[0]["unit"])
					mute();
					setTimeout(function(){
						mute();
						console.log('TTS: Time Up Time Up');
						var child_process = require('child_process');
						child_process.exec('google_speech -l en "Time Up Time Up"', function(error, stdout, stderr) {
						console.log(stdout);});
						setTimeout(mute,2000);
					},num)
			}
			else if(data.entities.intent[0]["value"] == 'traffic'){
				var distance = require('google-distance');
				distance.apiKey = '';
				
				//console.log(data.entities.location.length);
				if(data.entities.location===undefined){
						console.log('TTS: Invalid location');
						var child_process = require('child_process');
						child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
						console.log(stdout);});
						setTimeout(mute,3000);
				}
				else{
					var locnum = data.entities.location.length;			
					var destinations = data.entities.location[0]["value"];
					var sql = "SELECT * FROM defaultlocation";
					con.query(sql, function (err, result) {
						var origins = result[0].location;
						if(locnum>1){
							var origins = data.entities.location[0]["value"];
							var destinations = data.entities.location[1]["value"];
						}		
						else{
							var destinations = data.entities.location[0]["value"];
						}
						distance.get(
							  {
								origin: origins,
								destination: destinations
							  },
							  function(err, data) {
								if(data == undefined){
									console.log('TTS: Invalid location');
									var child_process = require('child_process');
									child_process.exec('google_speech -l en "Invalid location"', function(error, stdout, stderr) {
									console.log(stdout);});
									setTimeout(mute,3000);
								}
								else{	
									if (err) return console.log(err);
								//	console.log(data.distance);
								//	console.log(data.duration);
									//console.log(data);	
									console.log('TTS:  The distance from '+origins+' to '+destinations+' is '+data.distance+' ETA '+data.duration+' by car');
									var child_process = require('child_process');
									child_process.exec('google_speech -l en "The distance from '+origins+' to '+destinations+' is '+data.distance+' ETA '+data.duration+' by car"', function(error, stdout, stderr) {
									console.log(stdout);});
									setTimeout(mute,10000);
								}
							});
					})
				}
			}
			else{	
			  console.log('processing...');
			  //console.log("Intent: "+data.entities.intent[0]["value"]);
			  res = data.entities.intent[0]["value"];
			  if(data.entities.duration == undefined){
				  checkintent(res,usrinput);
				  setTimeout(mute, 3000);
			  }
			  else{
				  console.log('Timer: '+data.entities.duration[0]["value"]+' '+data.entities.duration[0]["unit"])
				  var num = data.entities.duration[0]["normalized"]["value"]*1000;
				  mute();
				  setTimeout(function(){
					mute();
					checkintent(res,usrinput,num)
					setTimeout(mute, 3000);
				  },num);
				  
			  }
			}
			  //console.log('Yay, got Wit.ai response: ' + JSON.stringify(data));
		})
		.catch(console.error);
	}
	});


	// Start recording and send the microphone input to the Speech API
	record.start({
	  sampleRateHertz: sampleRateHertz,
	  threshold: 0,
	  //verbose: true
	  verbose: false,
		recordProgram: 'rec', // Try also "arecord" or "sox"
		silence: '10.0',
	})
	.on('error', console.error)
	.pipe(recognizeStream);

	console.log('Listening, say exit to stop.\n');
	mute();
},60000)
console.log('Listening, say exit to stop.\n');
mute();