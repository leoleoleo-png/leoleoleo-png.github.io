/* =========== */
/* BEAT DETECT */
/* =========== */

function detectBeat(level) {
    //level should be from 0 to 1 (realistically 0 to 0.6~)
    //detect if level exceeds beatThreshold and beatCutoff
    //if not advance the frames
    if (level > beatCutoff && level > beatThreshold) {
        onBeat();
        beatCutoff = level * 1.1;
        framesSinceLastBeat = 0;
    } else {
        if (framesSinceLastBeat <= beatHoldFrames) {
            framesSinceLastBeat++;
        } else {
            beatCutoff *= beatDecayRate;
            beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
    }
}

function onBeat() {
    //define what should happen onBeat here
    amp = -0.15;
    move = random(0.75);
}

/* =============== */
/*    WORK AREA    */
/* =============== */

let theShader;
let cam;
let paintingImage;
let move;
let amp = 0;
var imgChoice;
let input;
function preload() {
    theShader = loadShader(
        "shader.vert",
        "shader.frag"
    );


    imgChoice = '../input/puzzle.jpg';
    paintingImage = loadImage(imgChoice);
}

function setup() {
    createCanvas(windowWidth * 0.9, windowHeight * 0.9, WEBGL);
    noStroke();

    audioSetup();
    fft.setInput(mic);
    move = 0.25;
    let limitLabel = createP("Sensitivity");

    limitLabel.parent(controller);
    limitLabel.position(10, 40);

    slider = createSlider(0.1,5.1,2.6,0.1);
    slider.parent(controller);

    let inputLabel = createP("Input your own image");

    inputLabel.parent(controller);
    inputLabel.position(10, 98);
    input = createFileInput(handleFile);
    input.parent(controller);
    let col = color(224, 224, 224,0);
    input.style('backgroundColor', col);
    input.style('color', '#F8F8FF');
    input.size(180, 30);


}

function draw() {

    audioDraw();
    let val = slider.value();
    detectBeat(val*micVolume);

    let freq = 10*val*micVolume
    amp += 0.025

    let scale = map(mouseY, 0, height, 1, 4)

    // send the two values to the shader
    theShader.setUniform("u_frequency", freq);
    theShader.setUniform("u_amplitude", amp);
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", frameCount * 0.01);
    theShader.setUniform("u_camTexture", paintingImage);
    theShader.setUniform("u_mouseCoord", map(mouseX, 0, width, 0, 1));
    theShader.setUniform("u_micVolume", micVolume);
    theShader.setUniform("u_scale", scale);
    theShader.setUniform("u_move", [move, move]);

    shader(theShader);

    rect(0, 0, width, height);
}



function handleFile(file) {

    if (file.type === 'image') {

        paintingImage = loadImage(file.data, '');
    } else {

    }
}