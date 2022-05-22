


let img;
let img2;
let img3;
let img4;
let img5;
let timer = 0;
let mic;
var shapes = 1;

function preload() {
  img4 = loadImage("img1.png");
  img5 = loadImage("img3.png");
  img2 = loadImage("flowers5.png");
  img3 = loadImage("img2.png");
}


function createMic() {
  mic = new p5.AudioIn();
  mic.start();

}

function getMicVolume() {
  micVolume = mic.getLevel();
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  userStartAudio();

  let limitLabel = createP("Sensitivity");
  limitLabel.parent(controller);

  slider = createSlider(0.1, 0.2, 0.15, 0.01);
  slider.parent(controller);

  limitLabel.position(5, 40);





}




function draw() {

  let val = slider.value();

  getMicVolume();
  let mix = val * 5 * micVolume;
  let spectrum = fft.analyze();
  let mox = map(mix, 0, 2, 2, 7);
  noStroke();

  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);

    fft.analyze();
  }

  imageMode(CENTER);


  let waveform = fft.waveform();

  beginShape();

  var varImg = img2;



  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);


    if (shapes == 1) {
      varImg = img2;
    } else if (shapes == 2) {
      varImg = img3;
    } else if (shapes == 3) {
      varImg = img4;
    }else if (shapes == 4) {
      varImg = img5;
    }

    image(varImg, x * 1.2, y, 100 * mix, 100 * mix);

  }

  endShape();


  copy(0, windowHeight / 2, windowWidth, 100, 0, 0, windowWidth, windowHeight / 2);

  copy(0, windowHeight / 2, windowWidth, 100, 0, windowHeight / 2, windowWidth , windowHeight / 2);

 /*  copy(0, 0, windowWidth, windowHeight, 0, 0, windowWidth*(mox/3) , windowHeight); */


  if (millis() >= 10000 + timer) {

    shapesRandom();
    
    timer = millis();
  }

}




function shapesRandom() {

  if (shapes == 1) {

    shapes = 2;
  } else if (shapes == 2) {

    shapes = 3;
  } else if (shapes == 3) {

    shapes = 4;
  }else if (shapes == 4) {

    shapes = 1;
  }

}

