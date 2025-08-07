import * as Soundfont from 'soundfont-player';
import { Knob } from './components/Knob';
import { addRecordingToDisplay } from './utls';

const octavePlus = document.getElementById("octave-plus")
const octaveMinus = document.getElementById("octave-minus")
const octaveValue = document.getElementById("octave-value")

const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination()
let recorder = new MediaRecorder(destination.stream)
let recordedChunks = []

let recordingCounts = 0

const Mixer = audioContext.createGain()
Mixer.connect(destination)
Mixer.connect(audioContext.destination)

customElements.define("ui-knob", Knob);

let keys = document.querySelectorAll(".btn");
let octave = 1;
let volKnob = document.getElementById("vol-knob");

const keyToNote = {};

keys.forEach(e => {
    const note = e.dataset.note.toUpperCase();
    const key = e.dataset.key;
    if (key && note) {
        keyToNote[key] = note;
    }
});


octaveMinus.onclick = () => {
    if(octave > 1) octave--
    octaveValue.innerText = octave
}


octavePlus.onclick = () => {
    octave++
    octaveValue.innerText = octave
}

const instrumentToggle = document.getElementById("instrumentToggle")

Soundfont.instrument(audioContext, 'acoustic_grand_piano', { destination: Mixer })
    .then(inst => {
        document.onkeydown = (pressedKey) => {
            console.log(pressedKey.key, keyToNote[pressedKey.key])
            const key = pressedKey.key.toLowerCase();
            const note = keyToNote[key];
            if (note) {
                inst.play(`${note}${octave}`, audioContext.currentTime, {
                    gain: volKnob.rotation / 100,
                    duration:document.getElementById("vol-duration").rotation/100,
                    attack:document.getElementById("vol-attack").rotation/100
                });
            }
        };

        keys.forEach(e => {
            const note = e.dataset.note.toUpperCase();
            e.onclick = () => {
                inst.play(`${note}${octave}`, audioContext.currentTime, {
                    gain: volKnob.rotation / 100,
                    duration:document.getElementById("vol-duration").rotation/100,
                    attack:document.getElementById("vol-attack").rotation/100
                });
            };
        });
    });



instrumentToggle.onchange = state => {


    Soundfont.instrument(audioContext, (state.target.checked ? 'acoustic_grand_piano' : 'acoustic_guitar_steel'), { destination: Mixer })
        .then(inst => {
            document.onkeydown = (pressedKey) => {
                console.log(pressedKey.key, keyToNote[pressedKey.key])
                const key = pressedKey.key.toLowerCase();
                const note = keyToNote[key];
                if (note) {
                    inst.play(`${note}${octave}`, audioContext.currentTime, {
                        gain: volKnob.rotation / 100
                    });
                }
            };

            keys.forEach(e => {
                const note = e.dataset.note.toUpperCase();
                e.onclick = () => {
                    inst.play(`${note}${octave}`, audioContext.currentTime, {
                        gain: volKnob.rotation / 100
                    });
                };
            });
        });


}

recorder.ondataavailable = e => {
    if (e.data.size > 0) recordedChunks.push(e.data);
};

const exportBtn = document.getElementById("export-btn")

recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    
    addRecordingToDisplay(url)

};

exportBtn.onclick = () => {
    
}


let startRec = document.getElementById("rec")
let stopRec = document.getElementById("stop-rec")

startRec.onclick = () => {
    recordedChunks = [];
    alert("Recording has started")
    recorder.start();
}

stopRec.onclick = () => {
    alert("Recording has been stopped, please hit export to export the file.")
    recorder.stop()
    recordingCounts += 1
}

