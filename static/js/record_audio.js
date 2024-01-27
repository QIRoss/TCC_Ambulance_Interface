let mediaRecorder;
let audioChunks = [];
let csrfToken = document.getElementById('csrfToken').value;

document.addEventListener('DOMContentLoaded', function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioPreview = document.getElementById('audioPreview');
                audioPreview.src = audioUrl;
                audioPreview.controls = true;

                const submitButton = document.getElementById('submitAudio');
                submitButton.disabled = false;
            });
        });
    
    document.getElementById('startRecording').addEventListener('click', function() {
        audioChunks = [];
        
        mediaRecorder.start();
        document.getElementById('startRecording').disabled = true;
        document.getElementById('stopRecording').disabled = false;
    });

    document.getElementById('stopRecording').addEventListener('click', function() {
        mediaRecorder.stop();
        document.getElementById('startRecording').disabled = false;
        document.getElementById('stopRecording').disabled = true;
    });

    document.getElementById('submitAudio').addEventListener('click', function() {
        const formData = new FormData();
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        formData.append('audio', audioBlob);

        $.ajax({
            url: '/ambulance/record-audio/',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            success: function(response) {
                document.getElementById('message').innerText = JSON.stringify(response);
            },
            error: function(xhr, status, error) {
                document.getElementById('message').innerHTML = '<p>Error submitting audio!</p>';
            }
        });
    });
});
