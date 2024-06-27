let mediaRecorder;
let recordedChunks = [];
let audioContext = null;
let audioSource = null;
let renderedBuffer = null;
let audioPreviewUrl = null; // Salva l'URL dell'anteprima audio corrente

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('recordButton').addEventListener('click', function() {
        document.getElementById('uploadButton').style.display = 'none';
        document.getElementById('recordButton').style.display = 'none';
        document.getElementById('stopButton').style.display = 'inline-block';
        startRecording();
    });

    document.getElementById('stopButton').addEventListener('click', function() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            this.style.display = 'none';
            document.getElementById('recordButton').style.display = 'inline-block';
            document.getElementById('uploadButton').style.display = 'inline-block';
        }
    });

    document.getElementById('uploadButton').addEventListener('click', function() {
        // Nascondi solo l'input file per evitare di selezionare un file audio duplicato
        document.getElementById('audioInput').style.display = 'inline-block';

        // Mostra l'input file per il caricamento
        document.getElementById('audioInput').click();
    });

    document.getElementById('audioInput').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            // Nascondi solo l'input file dopo aver selezionato un file audio
            this.style.display = 'none';

            // Resetta i dati del file audio precedente
            resetAudioData();

            startFileAudio(file);
        }
    });

    document.getElementById('processButton').addEventListener('click', function() {
        const effectIntensity = document.getElementById('gainSlider').value / 100;
        const maxEffectIntensity = 0.75;
        const finalEffectIntensity = Math.min(effectIntensity, maxEffectIntensity);

        if (audioContext && audioSource && renderedBuffer) {
            applyEffect(finalEffectIntensity);
        } else {
            alert("Carica o registra un file audio prima di applicare l'effetto.");
        }
    });

    document.getElementById('gainSlider').addEventListener('input', function() {
        document.getElementById('gainValue').innerText = this.value;

        // Se abbiamo già un'anteprima audio, applica l'effetto anche al nuovo valore dello slider
        if (audioPreviewUrl) {
            const effectIntensity = this.value / 100;
            const maxEffectIntensity = 0.75;
            const finalEffectIntensity = Math.min(effectIntensity, maxEffectIntensity);

            applyEffect(finalEffectIntensity);
        }
    });

    document.getElementById('gainValue').innerText = document.getElementById('gainSlider').value;
});

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

                const audioPreview = document.getElementById('audioPreview');
                audioPreview.src = url;
                audioPreview.controls = true;

                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = url;
                downloadLink.download = 'audio_registrato.webm';
                downloadLink.style.display = 'block';
                downloadLink.innerText = 'Scarica Audio Registrato';

                // Convert the recorded audio blob to AudioBuffer
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
                        gainNode.gain.value = 1; // No effect initially

                        audioSource.connect(gainNode);
                        gainNode.connect(audioContext.destination);

                        renderedBuffer = buffer; // Assign the rendered buffer

                        // Apply the robot effect (you can adjust intensity as needed)
                        applyEffect(0.5); // Example intensity

                        // Update preview and download links
                        updatePreviewAndDownload();
                    });
                };
                reader.readAsArrayBuffer(blob);

                // Reset the array of recorded chunks
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
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, function(buffer) {
            if (audioSource) {
                audioSource.stop();
            }

            audioSource = audioContext.createBufferSource();
            audioSource.buffer = buffer;

            const gainNode = audioContext.createGain();
            gainNode.gain.value = 1; // Nessun effetto applicato inizialmente

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

function updatePreviewAndDownload() {
    if (renderedBuffer) {
        const blob = bufferToWave(renderedBuffer, renderedBuffer.length);
        const url = URL.createObjectURL(blob);
        audioPreviewUrl = url; // Salva l'URL dell'anteprima audio

        const audioPreview = document.getElementById('audioPreview');
        audioPreview.src = url;
        audioPreview.controls = true;

        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = 'audio_modificato.wav';
        downloadLink.style.display = 'block';
        downloadLink.innerText = 'Scarica Audio Modificato';
    }
}

function resetAudioData() {
    audioContext = null;
    audioSource = null;
    renderedBuffer = null;
    audioPreviewUrl = null; // Resetta l'URL dell'anteprima audio

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

    for (i = 0; i < abuffer.numberOfChannels; i++)
        channels.push(abuffer.getChannelData(i));

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
