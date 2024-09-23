from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess

@api_view(['POST'])
def sqlmap_scan(request):
    url = request.data.get('url')
    if url:
        try:
            sqlmap_result = subprocess.run(
                ['sqlmap', '-u', url, '--crawl=2', '--batch', '--threads=1'],
                capture_output=True, text=True
            )
            return Response({
                "status": "Completed",
                "result": sqlmap_result.stdout
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
