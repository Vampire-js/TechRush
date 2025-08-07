export function addRecordingToDisplay(url) {
    const recordingsList = document.getElementById('recordingsList');
    const recordingItem = document.createElement('div');
    recordingItem.className = 'recording-item';
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    recordingItem.innerHTML = `
    <div>
    <div>
    <div >
        <span>Recording ${recordingsList.children.length + 1}</span>
        <small>${timestamp}</small>
        
</div>

<div>
        <audio src="${url}" controls style="width: 100%; margin-top: 8px;"></audio>
        
        <div>
    `;

    recordingsList.appendChild(recordingItem);
}
