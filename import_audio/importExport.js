const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.id = 'audioFileInput';
fileInput.accept = 'audio/*';
document.getElementById('main-content').appendChild(fileInput);
let file = null;
const reader = new FileReader();

export function handleFileUpload() {
    const fileInput = document.getElementById('audioFileInput');
    file = fileInput.files[0];

    if (file) {

        // reader.onload = function(event) {
        //     const audioPlayer = document.getElementById('audioPlayer');
        //     audioPlayer.src = event.target.result;
        // };

        reader.onerror = function(event) {
            console.error('Error reading file:', event.target.error);
        };

        // Read the file as a data URL (base64 encoded string)
        reader.readAsDataURL(file);
    } else {
        console.log('No file selected');
    }
}
export { fileInput, file };
