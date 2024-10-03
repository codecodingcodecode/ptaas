import subprocess
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def nikto_scan(request):
    url = request.data.get('url')
    threads = request.data.get('threads', 10)  # Threads-Parameter (Standardwert auf 10 gesetzt)
    
    if url:
        try:
            # Führe den Nikto-Scan mit mehreren Threads aus
            nikto_result = subprocess.run(
                ['nikto', '-h', url, '-T', str(threads)],  # Der -T Parameter für Threads
                capture_output=True, text=True
            )

            return Response({
                "status": "Completed",
                "result": nikto_result.stdout
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": "Failed",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({
            "error": "No URL provided"
        }, status=status.HTTP_400_BAD_REQUEST)
