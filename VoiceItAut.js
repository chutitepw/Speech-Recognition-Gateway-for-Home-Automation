myVoiceIt = require('VoiceIt');
// VoiceIT API key
myVoiceIt.initialize('');

console.log('Recording')
var child_process = require('child_process');
child_process.exec('arecord -D plughw:1,0 -d 4 --format S16_LE -r 48000 -c1 test.wav', function(error, stdout, stderr) {
console.log(stdout);})

myVoiceIt.authentication({
	userId: '',
	password: '',	
	pathToAuthenticationWav: 'test.wav',
	contentLanguage: 'en-US',
	callback: function(response){
	console.log("The Response Was ",response);
	myobj = JSON.stringify(response);
	console.log(myobj);
	console.log(myobj.Result);
	console.log(response.Result)
	console.log(response["Result"])
	console.log(response.Result);
	}
})

