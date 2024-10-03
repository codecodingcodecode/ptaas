from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess
import json

@api_view(['POST'])
def sqlmap_scan(request):
    url = request.data.get('url')
    if url:
        try:
            # Führt den SQLMap-Scan durch und gibt die Ergebnisse aus
            sqlmap_result = subprocess.run(
                ['sqlmap', '-u', url, '--crawl=2', '--batch', '--threads=1'],
                capture_output=True, text=True
            )
            raw_output = sqlmap_result.stdout

            # Versucht, die Ausgabe zu strukturieren (einfaches Parsen und Formatieren)
            # Hier wird einfach nach relevanten Abschnitten gesucht
            result_data = {
                "start_time": None,
                "end_time": None,
                "injections_found": False,
                "details": []
            }

            # Beispiel: Extrahiert bestimmte Textabschnitte, du kannst dies je nach Bedarf erweitern
            for line in raw_output.splitlines():
                if "[*] starting at" in line:
                    result_data["start_time"] = line.split("starting at")[-1].strip()
                if "[*] ending at" in line:
                    result_data["end_time"] = line.split("ending at")[-1].strip()
                if "[WARNING]" in line or "[INFO]" in line:
                    result_data["details"].append(line.strip())
                if "SQL injection vulnerability found" in line:
                    result_data["injections_found"] = True

            formatted_output = json.dumps(result_data, indent=4)

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
