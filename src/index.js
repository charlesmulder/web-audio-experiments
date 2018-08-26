
import * as _ from "lodash";
import * as math from 'mathjs'

const SAMPLE_RATE = 44100;
const N = 128;

var audioContext = new window.AudioContext({
    sampleRate: SAMPLE_RATE
});

var canvas = document.querySelector('#sineCanvas');
var canvasContext = canvas.getContext('2d');
canvasContext.fillStyle = 'green';

var analyser = audioContext.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
//analyser.smoothingTimeConstant = 0.85;
var oscillator = audioContext.createOscillator();
oscillator.type = 'sine';
oscillator.frequency.value = 1;

oscillator.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = N;
var timeBufferLength = analyser.fftSize;
var freqBufferLength =  analyser.frequencyBinCount;
console.log('time buffer length', timeBufferLength);
console.log('freq buffer length', freqBufferLength);
var freqBuffer = new Uint8Array(freqBufferLength); // values in array is between 0 - 255, divide by 128 to 
var timeBuffer = new Uint8Array(timeBufferLength);
var binWidth = SAMPLE_RATE/N;
console.log('sample rate', SAMPLE_RATE);
console.log('N', N);
console.log('bin width', binWidth);
//var dataArray = new Float32Array(bufferLength);

function calculateFrequencyForIntervalRelativeTo(interval, referenceFrequency) {
    return referenceFrequency * Math.pow(2, interval/12);
}

var x = 0;
var sliceWidth = canvas.width / timeBufferLength;
function draw() {
    var drawVisual = requestAnimationFrame(draw);
    //analyser.getByteFrequencyData(freqBuffer);
    //console.log(`current time is ${audioContext.currentTime}`);
    if(audioContext.currentTime > 1.1) {
        cancelAnimationFrame(drawVisual);
    }
    analyser.getByteTimeDomainData(timeBuffer);
    //canvasContext.fillStyle = 'rgb(200, 200, 200)';
    //canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    //console.log('time buffer', timeBuffer);
    //var y = canvas.height-timeBuffer[timeBufferLength/2];
    var y = canvas.height - math.mean(Array.from(timeBuffer))-1;
    x += sliceWidth;
    //console.log(`x is ${x} and y is ${y}`);
    canvasContext.fillRect(x , y, 3, 3);
    /*
    if(x === 0) {
        canvasContext.moveTo(x,y);
    } else {
        canvasContext.lineTo(x, y);
    }
    x += sliceWidth;
    canvasContext.stroke();
    */

    /*
    for(var i = 0; i < bufferLength; i++) {
        var y = canvas.height-timeBuffer[i];
        if(i === 0) {
            console.log(`moving to x ${x} and y ${y}`);
            canvasContext.moveTo(x, y);
        } else {
            console.log(`line to x ${x} and y ${y}`);
            canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
    }
    canvasContext.stroke();
    */


    /*
    var barWidth = (canvas.width / bufferLength);
    var barHeight;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        //console.log('frequency in Hz ', barHeight * 44100 / bufferLength);
        canvasContext.fillStyle = 'black';
        canvasContext.fillRect(x, canvas.height, barWidth, -barHeight);
        x += barWidth;
    }
    */

}

draw();
oscillator.start();
oscillator.stop(audioContext.currentTime + 2);

