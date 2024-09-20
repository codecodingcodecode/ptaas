# backend/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def start_scan(request):
    url = request.data.get('url')
    # Hier führst du den Penetrationstest (z.B. Nikto) aus.
    # Für jetzt geben wir einfach eine Testantwort zurück.
    return Response({"message": f"Scan gestartet für {url}"})
