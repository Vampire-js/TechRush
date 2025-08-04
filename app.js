const knob = document.getElementById("knob")

const calculateRotation = (dist , speed) => {
    return speed * dist/2;
}

knob.onclick = () => {

    knob.addEventListener("mousemove", e => {
        knob.style.transform = `rotate(${calculateRotation(e.clientX, 5)}deg)`;
    })
}