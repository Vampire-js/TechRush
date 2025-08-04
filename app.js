const knob = document.getElementById("knob")

const calculateRotation = (dist, speed) => {
    return speed * dist / 2;
}

let isDragging = false
let lastY = 0
let rotation = 0
knob.onpointerdown = e => {
    isDragging = true
    lastY = e.clientY
    knob.setPointerCapture(e.pointerId)
}

knob.onpointermove = (e) => {
    if(!isDragging) return
    const deltaY = lastY - e.clientY
    rotation += deltaY * .5;
    rotation = Math.max(0, Math.min(270, rotation))

    knob.style.transform = `rotate(${rotation}deg)`
    lastY = e.clientY
}

knob.onpointerup = () => {
    isDragging = false
}