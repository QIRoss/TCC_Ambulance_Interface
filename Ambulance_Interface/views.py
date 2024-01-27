from django.shortcuts import render
import requests
import magic
from pydub import AudioSegment
from django.http import JsonResponse

def record_audio(request):
    if request.method == 'POST' and request.FILES.get('audio'):
        audio_file = request.FILES['audio']

        audio_type = magic.from_buffer(audio_file.read(), mime=True)
        if audio_type != 'video/webm':
            return JsonResponse({'error': 'Invalid audio file format. Expected: video/webm'}, status=400)

        audio_file.seek(0)

        audio = AudioSegment.from_file(audio_file, format='webm')
        wav_data = audio.export(format='wav')

        transcribe_url = 'http://127.0.0.1:5000/transcribe'
        files = {'file': ('uploaded_audio.wav', wav_data)}
        response = requests.post(transcribe_url, files=files)

        if response.status_code == 200:
            second_response = requests.get('http://127.0.0.1:2947')

            if second_response.status_code == 200:
                return JsonResponse({
                    'transcription': response.json(),
                    'second_response_data': second_response.json()
                })
            else:
                return JsonResponse({
                    'transcription': response.json(),
                    'error': 'Failed to fetch data from 127.0.0.1:2947'
                }, status=500)
        else:
            return JsonResponse({'error': 'Failed to transcribe audio'}, status=500)

    return render(request, 'record_audio.html')