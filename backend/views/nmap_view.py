from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess

@api_view(['POST'])
def nmap_scan(request):
    url = request.data.get('url')
    if url:
        try:
            nmap_result = subprocess.run(['nmap', '-Pn', '-p-', url], capture_output=True, text=True)
            return Response({
                "status": "Completed",
                "result": nmap_result.stdout
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
