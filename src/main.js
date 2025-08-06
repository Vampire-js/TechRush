import * as Soundfont from 'soundfont-player';
import { Knob } from './components/Knob';

const audioContext = new AudioContext();
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

Soundfont.instrument(audioContext, 'acoustic_grand_piano')
    .then(inst => {
        document.onkeydown = (pressedKey) => {
            console.log(pressedKey.key , keyToNote[pressedKey.key])
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
