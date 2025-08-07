import * as Soundfont from 'soundfont-player';
import { Knob } from './components/Knob';

const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();
let recorder = new MediaRecorder(destination.stream);
let recordedChunks = [];

const Mixer = audioContext.createGain();
Mixer.connect(destination);
Mixer.connect(audioContext.destination);

customElements.define("ui-knob", Knob);

let keys = document.querySelectorAll(".btn");
let octave = 4;
let volKnob = document.getElementById("vol-knob");

const keyToNote = {};
const keyElements = {};

keys.forEach(e => {
    const note = e.dataset.note.toUpperCase();
    const key = e.dataset.key;
    if (key && note) {
        keyToNote[key] = note;
        keyElements[key] = e;
    }
});

const instrumentToggle = document.getElementById("instrumentToggle");
const body = document.body;
const container = document.getElementById('container');
const modeText = document.getElementById('modeText');

// Sprite animation elements
const jotaroSprite = document.getElementById('jotaro-sprite');
const giornoSprite = document.getElementById('giorno-sprite');

let currentInstrument = null;
let animationTimeout = null;

function loadInstrument(name) {
    return Soundfont.instrument(audioContext, name, { destination: Mixer }).then(inst => {
        currentInstrument = inst;
        return inst;
    });
}

function animateCharacter(isPlaying = false) {
    const isPianoMode = instrumentToggle.checked;

    if (isPianoMode && giornoSprite) {
        giornoSprite.className = isPlaying ? 'giorno-sprite giorno-playing' : 'giorno-sprite giorno-idle';

        if (isPlaying) {
            clearTimeout(animationTimeout);
            animationTimeout = setTimeout(() => {
                giornoSprite.className = 'giorno-sprite giorno-idle';
            }, 500);
        }
    } else if (!isPianoMode && jotaroSprite) {
        jotaroSprite.className = isPlaying ? 'sprite-container jotaro-playing' : 'sprite-container jotaro-idle';

        if (isPlaying) {
            clearTimeout(animationTimeout);
            animationTimeout = setTimeout(() => {
                jotaroSprite.className = 'sprite-container jotaro-idle';
            }, 600);
        }
    }
}

function setupInstrumentListeners(inst) {
    document.onkeydown = (pressedKey) => {
        const key = pressedKey.key.toLowerCase();
        const note = keyToNote[key];
        if (note) {
            if (keyElements[key]) {
                keyElements[key].classList.add('active');
                setTimeout(() => {
                    keyElements[key].classList.remove('active');
                }, 300);
            }

            inst.play(`${note}${octave}`, audioContext.currentTime, {
                gain: volKnob.rotation / 100
            });

            animateCharacter(true);
        }
    };

    keys.forEach(e => {
        const note = e.dataset.note.toUpperCase();
        e.onclick = () => {
            e.classList.add('active');
            setTimeout(() => {
                e.classList.remove('active');
            }, 300);

            inst.play(`${note}${octave}`, audioContext.currentTime, {
                gain: volKnob.rotation / 100
            });

            animateCharacter(true);
        };
    });
}

loadInstrument('acoustic_grand_piano').then(inst => {
    setupInstrumentListeners(inst);
    animateCharacter(false);
});

instrumentToggle.onchange = state => {
    const instrument = state.target.checked ? 'acoustic_grand_piano' : 'acoustic_guitar_steel';
    loadInstrument(instrument).then(inst => {
        setupInstrumentListeners(inst);
        animateCharacter(false);
    });

    if (state.target.checked) {
        body.classList.add('piano-mode');
        container.classList.remove('modebackgroundg');
        if (modeText) modeText.textContent = 'Piano Mode';
    } else {
        body.classList.remove('piano-mode');
        container.classList.add('modebackgroundg');
        if (modeText) modeText.textContent = 'Guitar Mode';
    }
};

recorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
};

recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();

    addRecordingToDisplay(url);
};

function addRecordingToDisplay(url) {
    const recordingsList = document.getElementById('recordingsList');
    const recordingItem = document.createElement('div');
    recordingItem.className = 'recording-item';
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    recordingItem.innerHTML = `
        <span>Recording ${recordingsList.children.length + 1}</span>
        <small>${timestamp}</small>
        <audio src="${url}" controls style="width: 100%; margin-top: 8px;"></audio>
    `;

    recordingsList.appendChild(recordingItem);
}

let startRec = document.getElementById("rec");
let stopRec = document.getElementById("stop-rec");

startRec.onclick = () => {
    recordedChunks = [];
    recorder.start();
    startRec.textContent = "RECORDING...";
    startRec.style.background = "linear-gradient(145deg, #ff0000, #cc0000)";
    startRec.style.boxShadow = "0 0 20px rgba(255, 0, 0, 0.5)";
};

stopRec.onclick = () => {
    recorder.stop();
    startRec.textContent = "START RECORDING";
    startRec.style.background = "linear-gradient(145deg, #dc3545, #c82333)";
    startRec.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
};
document.addEventListener('DOMContentLoaded', () => {
    animateCharacter(false);
});