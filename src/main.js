import * as Soundfont from 'soundfont-player';
import { Knob } from './components/Knob';

const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination()
let recorder = new MediaRecorder(destination.stream)
let recordedChunks = []

const Mixer = audioContext.createGain()
Mixer.connect(destination)
Mixer.connect(audioContext.destination)

customElements.define("ui-knob", Knob);

let keys = document.querySelectorAll(".btn");
let octave = 4;
let volKnob = document.getElementById("vol-knob");

const keyToNote = {};

keys.forEach(e => {
    const note = e.dataset.note.toUpperCase();
    const key = e.dataset.key;
    if (key && note) {
        keyToNote[key] = note;
    }
});

const instrumentToggle = document.getElementById("instrumentToggle")

Soundfont.instrument(audioContext, 'acoustic_grand_piano', { destination: Mixer })
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

recorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
};


let startRec = document.getElementById("rec")
let stopRec = document.getElementById("stop-rec")

startRec.onclick = () => {
    recordedChunks = [];
    recorder.start();
}

stopRec.onclick = () => {
    recorder.stop()
}

