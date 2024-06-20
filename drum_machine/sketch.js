let hh, clap, bass; //instruments
let masterPat, hPat, cPat, bPat, timePat; //patterns; where its decided when the sound will play
let hPhrase, cPhrase, bPhrase; //phrases; where the patterns are attached to the sound
let drums; //part or partiture; where the phrases are added together
let bpmSlide; //slider to change the bpm
let beatLength; //length of the bar (so 16 is 16 notes in a loop)
let cnv; //canvas
let cursorP; //cursor position


function setup() {
	cnv = createCanvas(320, 60);
	cnv.mousePressed(canvasPressed);
	beatLength = 16;
	cursorP = 0;

	// where the sounds are loaded
	hh = loadSound("assets/hh_sample.mp3", () => {});
	clap = loadSound("assets/clap_sample.mp3", () => {});
	bass = loadSound("assets/bass_sample.mp3", () => {});

	// where the patterns are defined
	pats();
	hihat();
	claps();
	ft_bass();


	// where phrases are added together to drums object
	drums = new p5.Part();
	drums.addPhrase(hPhrase);
	drums.addPhrase(cPhrase);
	drums.addPhrase(bPhrase);
	drums.addPhrase('seq', sequence, timePat);

	// slider and bpm
	bpmSlide = createSlider(20, 220, 90, 1);
	bpmSlide.position(10, 70);
	bpmSlide.input(() => {
		drums.setBPM(bpmSlide.value());
	});
	drums.setBPM("80");
	// background(80);

	// dots();
}

function draw() {
	background(80);
	dots();
	beatTracker();
}

// stop and play the loop with space bar
function keyPressed() {
	if (key === " ") {
		console.log("key press");
		if (hh.isLoaded() && clap.isLoaded() && bass.isLoaded()) {
			if (!drums.isPlaying) drums.loop();
			else drums.stop();
		} else console.log("drums loading ...");
	}
}

// mouse actions - when clicked, change the pattern
function canvasPressed() {
	let rowClicked = floor(3*mouseY/height + 1);
	let indexClicked = floor(beatLength*mouseX/width);
	masterPat[rowClicked][indexClicked] = masterPat[rowClicked][indexClicked] === 1 ? 0 : 1;
}

// function to define the patterns and the global master pattern which is used to draw the dots
function pats() {
	timePat = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
	hPat = [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
	cPat = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0];
	bPat = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0];
	masterPat = [timePat, hPat, cPat, bPat];
}


function hihat() {
	// hPat = [1, 1, 1, 0];
	hPhrase = new p5.Phrase(
		"hh",
		(time) => {
			hh.play(time, 1);
			// console.log(time);
		},
		hPat
	);
}

function claps() {
	// cPat = [0, 0, 1, 0];
	cPhrase = new p5.Phrase(
		"hh",
		(time) => {
			clap.play(time, random(1, 4), random(0.3, 1.0));
			// console.log(time);
		},
		cPat
	);
}

function ft_bass() {
	// bPat = [1, 0, 0, 1, 0, 0];
	bPhrase = new p5.Phrase(
		"hh",
		(time) => {
			bass.play(time, random(0, 2), random(0.5, 2));
			// console.log(time);
		},
		bPat
	);
}

// function that follows the beat of the sequence
function sequence(time, beatIndex) {
	// stroke('red');
	// fill('red');
	setTimeout(() => {
		console.log(beatIndex);
		cursorP = beatIndex - 1;
	}, time * 1000);
}

// function that draws the dots and the grid
function dots() {
	stroke("gray");
	strokeWeight(2);
	for (let i = 0; i < beatLength + 1; i++) {
		line((i * width) / beatLength, 0, (i * width) / beatLength, height);
	}
	for (let i = 0; i < 4; i++) {
		line(0, (i * height) / 3, width, (i * height) / 3);
	}
	noStroke();
	fill('gray');
	for (let j = 1; j < 4; j++) {
		for (let i = 0; i < beatLength; i++) {
			if (masterPat[j][i] === 1)
				ellipse(
					(i * width) / beatLength + (0.5 * width) / beatLength,
					(height / 3) * j - height / 6,
					10
				);
		}
	}
}

// function that draws the red cursor
function beatTracker() {
	stroke('red');
	fill(255,0,0,30);
	rect(cursorP * (width / beatLength), 0 , width / beatLength, height);
}

// function to resume audio context - needed for web browsers to play audio, since they block it by default
function touchStarted() {
	getAudioContext().resume().then(() => {
		console.log('Audio resumed');
	});
}
