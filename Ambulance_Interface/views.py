from django.shortcuts import render
from django.http import JsonResponse

def record_audio(request):
    if request.method == 'POST' and request.FILES.get('audio'):
        audio_file = request.FILES['audio']
        with open('uploaded_audio.wav', 'wb') as f:
            for chunk in audio_file.chunks():
                f.write(chunk)
        return JsonResponse({'message': 'Audio uploaded successfully'})
    else:
        return render(request, 'record_audio.html')
