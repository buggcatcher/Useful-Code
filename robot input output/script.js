let mediaRecorder;
let recordedChunks = [];
let audioContext = null;
let audioSource = null;
let renderedBuffer = null;
let audioPreviewUrl = null; // Salva l'URL dell'anteprima audio corrente

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    document.getElementById('gainValue').innerText = document.getElementById('gainSlider').value;
});

function setupEventListeners() {
    document.getElementById('recordButton').addEventListener('click', startRecordingHandler);
    document.getElementById('stopButton').addEventListener('click', stopRecordingHandler);
    document.getElementById('uploadButton').addEventListener('click', uploadAudioHandler);
    document.getElementById('audioInput').addEventListener('change', audioInputChangeHandler);
    document.getElementById('processButton').addEventListener('click', processAudioHandler);
    document.getElementById('gainSlider').addEventListener('input', gainSliderInputHandler);
}

function startRecordingHandler() {
    document.getElementById('uploadButton').style.display = 'none';
    document.getElementById('recordButton').style.display = 'none';
    document.getElementById('stopButton').style.display = 'inline-block';
    startRecording();
}

function stopRecordingHandler() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        this.style.display = 'none';
        document.getElementById('recordButton').style.display = 'inline-block';
        document.getElementById('uploadButton').style.display = 'inline-block';
    }
}

function uploadAudioHandler() {
    document.getElementById('audioInput').style.display = 'inline-block';
    document.getElementById('audioInput').click();
}

function audioInputChangeHandler() {
    const file = this.files[0];
    if (file) {
        this.style.display = 'none';
        resetAudioData();
        startFileAudio(file);
    }
}

function processAudioHandler() {
    const effectIntensity = document.getElementById('gainSlider').value / 100;
    const maxEffectIntensity = 0.75;
    const finalEffectIntensity = Math.min(effectIntensity, maxEffectIntensity);

    if (audioContext && audioSource && renderedBuffer) {
        applyEffect(finalEffectIntensity);
    } else {
        alert("Carica o registra un file audio prima di applicare l'effetto.");
    }
}

function gainSliderInputHandler() {
    document.getElementById('gainValue').innerText = this.value;

    if (audioPreviewUrl) {
        const effectIntensity = this.value / 100;
        const maxEffectIntensity = 0.75;
        const finalEffectIntensity = Math.min(effectIntensity, maxEffectIntensity);
        applyEffect(finalEffectIntensity);
    }
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function(e) {
                recordedChunks.push(e.data);
            };

            mediaRecorder.onstop = function() {
                const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                audioPreviewUrl = url; // Save the URL of the preview audio

                updatePreviewAndDownload(url, 'audio_registrato.webm', 'Scarica Audio Registrato');
                convertBlobToAudioBuffer(blob);
                recordedChunks = [];
            };

            mediaRecorder.start();
        })
        .catch(function(err) {
            console.error('Errore durante l\'accesso al microfono: ' + err);
        });
}

function startFileAudio(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        createAudioContext(event.target.result);
    };
    reader.readAsArrayBuffer(file);
}

function applyEffect(intensity) {
    const offlineContext = new OfflineAudioContext(1, renderedBuffer.length, renderedBuffer.sampleRate);
    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = renderedBuffer;

    const gainNode = offlineContext.createGain();
    gainNode.gain.value = 1 - intensity;

    const delayNode = offlineContext.createDelay();
    delayNode.delayTime.value = 0.02;

    const feedbackGainNode = offlineContext.createGain();
    feedbackGainNode.gain.value = intensity;

    offlineSource.connect(gainNode);
    gainNode.connect(offlineContext.destination);

    offlineSource.connect(delayNode);
    delayNode.connect(feedbackGainNode);
    feedbackGainNode.connect(delayNode);
    feedbackGainNode.connect(offlineContext.destination);

    offlineSource.start(0);
    offlineContext.startRendering().then(function(newBuffer) {
        renderedBuffer = newBuffer;
        updatePreviewAndDownload();
    });
}

function updatePreviewAndDownload(url = null, filename = 'audio_modificato.wav', linkText = 'Scarica Audio Modificato') {
    if (!url && renderedBuffer) {
        const blob = bufferToWave(renderedBuffer, renderedBuffer.length);
        url = URL.createObjectURL(blob);
        audioPreviewUrl = url;
    }

    if (url) {
        const audioPreview = document.getElementById('audioPreview');
        audioPreview.src = url;
        audioPreview.controls = true;

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.style.display = 'block';
        downloadLink.innerText = linkText;
    }
}

function resetAudioData() {
    audioContext = null;
    audioSource = null;
    renderedBuffer = null;
    audioPreviewUrl = null;

    const audioPreview = document.getElementById('audioPreview');
    audioPreview.src = '';
    audioPreview.controls = false;

    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = '';
    downloadLink.style.display = 'none';
}

function bufferToWave(abuffer, len) {
    let numOfChan = abuffer.numberOfChannels,
        length = len * numOfChan * 2 + 44,
        buffer = new ArrayBuffer(length),
        view = new DataView(buffer),
        channels = [],
        i, sample,
        offset = 0,
        pos = 0;

    function setUint16(data) {
        view.setUint16(pos, data, true);
        pos += 2;
    }

    function setUint32(data) {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    for (i = 0; i < abuffer.numberOfChannels; i++) {
        channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = (0.5 + sample * 32767) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([buffer], { type: "audio/wav" });
}

function convertBlobToAudioBuffer(blob) {
    const reader = new FileReader();
    reader.onload = function(event) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, function(buffer) {
            if (audioSource) {
                audioSource.stop();
            }

            audioSource = audioContext.createBufferSource();
            audioSource.buffer = buffer;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 1;

            audioSource.connect(gainNode);
            gainNode.connect(audioContext.destination);

            renderedBuffer = buffer;
            applyEffect(0.5);
            updatePreviewAndDownload();
        });
    };
    reader.readAsArrayBuffer(blob);
}

function createAudioContext(arrayBuffer) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.decodeAudioData(arrayBuffer, function(buffer) {
        if (audioSource) {
            audioSource.stop();
        }

        audioSource = audioContext.createBufferSource();
        audioSource.buffer = buffer;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1;

        audioSource.connect(gainNode);
        gainNode.connect(audioContext.destination);

        const offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
        const offlineSource = offlineContext.createBufferSource();
        offlineSource.buffer = buffer;

        const offlineGainNode = offlineContext.createGain();
        offlineGainNode.gain.value = 1;

        offlineSource.connect(offlineGainNode);
        offlineGainNode.connect(offlineContext.destination);

        offlineSource.start(0);
        offlineContext.startRendering().then(function(newBuffer) {
            renderedBuffer = newBuffer;
            updatePreviewAndDownload();
        });
    });
}
