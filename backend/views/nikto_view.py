from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess

@api_view(['POST'])
def nikto_scan(request):
    url = request.data.get('url')
    if url:
        try:
            # Nikto scan logic
            nikto_result = subprocess.run(['nikto', '-h', url], capture_output=True, text=True)
            return Response({
                "status": "Completed",
                "result": nikto_result.stdout
            })
        except Exception as e:
            return Response({
                "status": "Failed",
                "error": str(e)
            }, status=500)
    else:
        return Response({
            "error": "No URL provided"
        }, status=400)
