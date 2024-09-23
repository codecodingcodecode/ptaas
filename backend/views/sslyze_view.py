from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess
import re

@api_view(['POST'])
def sslyze_scan(request):
    url = request.data.get('url')
    if url:
        try:
            # SSLyze Scan
            cleaned_url = re.sub(r'^https?://', '', url)
            if ':' not in cleaned_url:
                cleaned_url = f"{cleaned_url}:443"

            sslyze_result = subprocess.run(['sslyze', cleaned_url], capture_output=True, text=True)
            return Response({
                "status": "Completed",
                "result": sslyze_result.stdout
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
