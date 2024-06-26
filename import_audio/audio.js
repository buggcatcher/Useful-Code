import { createButton } from './buttonCreate.js';
import { fileInput, file, handleFileUpload } from './importExport.js';

let audioContext = null;
let arrayBuffer = null;
let audioBuffer = null;
let toneBuffer = null;
let player = null;
let fft = null;

let synth;
let	noise = new Tone.Noise("pink");
let autoFilter = new Tone.AutoFilter({
	"frequency": "16n",
	"min": 800,
	"max": 15000
}).toDestination();

let pingPong = new Tone.PingPongDelay("4n", 0.2).toDestination();
noise.connect(autoFilter);
// autoFilter.start();



synth = new Tone.Synth().toDestination();
synth.connect(autoFilter);

createButton('Play', 'play', 'button', () => {
	synth.triggerAttackRelease("C4",Math.random() * 10 / 5);
	autoFilter.start();
});

createButton('Upload', 'uploadButton', null, handleFileUpload);
async function processFile() {
    if (file) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        arrayBuffer = await file.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        toneBuffer = new Tone.ToneAudioBuffer(audioBuffer);
        player = new Tone.Player(toneBuffer).toDestination();
        fft = new Tone.FFT(256);
        player.connect(fft);
		player.connect(autoFilter);
		player.connect(pingPong);
		alert('File uploaded successfully');
        // player.start();
		// console.log(fft.getValue());

        // setInterval(() => {
        //     let array = fft.getValue();
        //     console.log(array);
        // }, 5000);
    } else {
        console.log('No file to process');
    }
}

createButton('player', 'player', 'button', () => {
	if (player.state === "started") {
		player.stop();
	}
	else if (player) {
		player.start();
		console.log(player.state);
	}
	else {
		console.log('No audio to play');
	}
});
createButton('Get FFT Value', 'getFftValue', 'button', getFftValue);

function getFftValue() {
	if (player.state === "started") {
		console.log(fft.getValue());
	}
}

// Listen for file input change
fileInput.addEventListener('change', handleFileUpload);
// fileInput.addEventListener('change', processFile);
document.getElementById('uploadButton').addEventListener('click', processFile);



createButton('noise', 'noise', 'button', () => {
	if(noise.state === "started") {
		noise.stop();
		autoFilter.stop();
	}
	else {
		noise.start();
		autoFilter.start();
	}
});

// intervalTone();

// function intervalTone() {
// 	let tempo;
// 	while (true) {
// 		tempo =  Tone.now();
// 		console.log(tempo);
// 		if (tempo % 2 === 0) {
// 			synth.triggerAttackRelease("C4", tempo);
// 		}
// 	}
// }

function touchStarted() {
	if (getAudioContext().state !== "running") {
		console.log("audio context is not running");
		getAudioContext().resume();
	}
}



