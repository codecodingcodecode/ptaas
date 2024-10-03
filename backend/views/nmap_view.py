from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess
import json
import xmltodict

@api_view(['POST'])
def nmap_scan(request):
    url = request.data.get('url')
    if url:
        try:
            # Führt den Nmap-Scan durch und gibt die Ergebnisse im XML-Format aus
            nmap_result = subprocess.run(['nmap', '-Pn', '-p-', '-oX', '-', url], capture_output=True, text=True)
            xml_output = nmap_result.stdout

            # Konvertiere XML-Ausgabe in JSON
            json_output = xmltodict.parse(xml_output)
            formatted_output = json.dumps(json_output, indent=4)  # Pretty JSON formatting

            return Response({
                "status": "Completed",
                "result": formatted_output
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
