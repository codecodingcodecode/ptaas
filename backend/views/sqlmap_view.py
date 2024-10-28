from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
import subprocess
import json

@api_view(['POST'])
def sqlmap_scan(request):
    url = request.data.get('url')
    
    # Zusätzliche Parameter für aggressiveren Test
    crawl_depth = request.data.get('crawl_depth', 3)  # Standardmäßig 3
    threads = request.data.get('threads', 5)  # Standardmäßig 5 Threads
    level = request.data.get('level', 5)  # Level von 1 bis 5, standardmäßig 5
    risk = request.data.get('risk', 3)  # Risk Level von 1 bis 3, standardmäßig 3
    test_forms = request.data.get('forms', True)  # Testet auch Formulare
    
    if url:
        try:
            # Bereite SQLMap-Befehl vor
            sqlmap_command = [
                'sqlmap', '-u', url, f'--crawl={crawl_depth}', '--batch',
                f'--threads={threads}', f'--level={level}', f'--risk={risk}'
            ]

            # Teste auch POST-Formulare, falls aktiviert
            if test_forms:
                sqlmap_command.append('--forms')
            
            # Führe den SQLMap-Scan aus
            sqlmap_result = subprocess.run(sqlmap_command, capture_output=True, text=True)
            raw_output = sqlmap_result.stdout

            # Strukturierte Ergebnisse vorbereiten
            result_data = {
                "start_time": None,
                "end_time": None,
                "injections_found": False,
                "details": []
            }

            # Parse die Ausgabe von SQLMap
            for line in raw_output.splitlines():
                if "[*] starting at" in line:
                    result_data["start_time"] = line.split("starting at")[-1].strip()
                if "[*] ending at" in line:
                    result_data["end_time"] = line.split("ending at")[-1].strip()
                if "[WARNING]" in line or "[INFO]" in line:
                    result_data["details"].append(line.strip())
                if "SQL injection vulnerability found" in line:
                    result_data["injections_found"] = True

            # Formatiere die Ausgabe und gebe sie zurück
            return Response({
                "status": "Completed",
                "result": result_data
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
