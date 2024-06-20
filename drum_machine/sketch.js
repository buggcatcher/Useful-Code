let hh, clap, bass; //hi-hat
let masterPat, hPat, cPat, bPat, timePat; //hihat patern. array of numbers to manipulate the beats
let hPhrase, cPhrase, bPhrase; // defines how hihat pattern is interpreted
let drums; //part. we will attach the phrase to part, which wil lserve as our transport to drive the phrase
let bpmSlide;
let beatLength;
let cnv;
let cursorP;


function setup() {
  cnv = createCanvas(320, 60);
  cnv.mousePressed(canvasPressed);
  beatLength = 16;
  cursorP = 0;
  hh = loadSound("assets/hh_sample.mp3", () => {});
  clap = loadSound("assets/clap_sample.mp3", () => {});
  bass = loadSound("assets/bass_sample.mp3", () => {});
  // masterPat = {}
  pats();
  console.log(masterPat[2]);
  hihat();
  claps();
  ft_bass();

  drums = new p5.Part();
  drums.addPhrase(hPhrase);
  drums.addPhrase(cPhrase);
  drums.addPhrase(bPhrase);
  // drums.addPhrase('seq', sequence, timePat);

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
  // console.log('x')
  dots();
}

function keyPressed() {
  if (key === " ") {
    console.log("key press");
    if (hh.isLoaded() && clap.isLoaded() && bass.isLoaded()) {
      if (!drums.isPlaying) drums.loop();
      else drums.stop();
    } else console.log("drums loading ...");
  }
}

function canvasPressed() {
  let rowClicked = floor(3*mouseY/height + 1);
  let indexClicked = floor(beatLength*mouseX/width);
  masterPat[rowClicked][indexClicked] = masterPat[rowClicked][indexClicked] === 1 ? 0 : 1;
}

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

// function sequence(time, beatIndex) {
//   stroke('red');
//   console.log(beatIndex);
//   rect(beatIndex*, 0 , cel, height)
// }

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

function touchStarted() {
  getAudioContext().resume().then(() => {
	  console.log('Audio resumed');
  });
}
