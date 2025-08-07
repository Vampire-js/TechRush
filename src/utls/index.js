export function addRecordingToDisplay(url) {
    const recordingsList = document.getElementById('recordingsList');
    const recordingItem = document.createElement('div');
    recordingItem.className = 'recording-item';
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    recordingItem.innerHTML = `
  <div style="width:100%;">
    <div>
        <span>Recording ${recordingsList.children.length + 1}</span>
        <small>${timestamp}</small>
        

<div>
        <audio src="${url}" controls style="width: 100%; margin-top: 8px;"></audio>
        <a class="export-btn" href="${url}" download="recording.webm" style="
    display: inline-block; 
    padding: 6px 12px; 
    margin-top: 8px;
    background-color: transparent; 
    color: white; 
    text-align: center; 
    text-decoration: none; 
    border-radius: 4px; 
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  ">Export</a>
        <div>
       
    `;

    recordingsList.appendChild(recordingItem);
}
