import subprocess
import re
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

@api_view(['POST'])
def sslyze_scan(request):
    url = request.data.get('url')
    if url:
        try:
            # Entferne 'http://' oder 'https://' aus der URL
            cleaned_url = re.sub(r'^https?://', '', url)
            if ':' not in cleaned_url:
                cleaned_url = f"{cleaned_url}:443"  # Standardport für SSL

            # Unterdrücke Python-Warnungen
            os.environ['PYTHONWARNINGS'] = 'ignore'

            # Führe den SSLyze-Scan mit JSON-Ausgabe aus
            sslyze_result = subprocess.run(
                [
                    'sslyze',
                    '--json_out=-',
                    '--certinfo',
                    '--tlsv1_2',
                    '--tlsv1_3',
                    '--robot',
                    '--http_headers',
                    '--heartbleed',
                    cleaned_url
                ],
                capture_output=True, text=True, check=True
            )
            raw_output = sslyze_result.stdout

            # Parsen der JSON-Ausgabe
            try:
                output_json = json.loads(raw_output)
            except json.decoder.JSONDecodeError as e:
                return Response({
                    "status": "Failed",
                    "error": f"JSON decoding failed: {str(e)}",
                    "raw_output": raw_output,
                    "stderr": sslyze_result.stderr
                }, status=500)

            # Gebe die gesamte JSON-Ausgabe zurück
            return Response({
                "status": "Completed",
                "result": output_json
            }, status=200)

        except subprocess.CalledProcessError as e:
            return Response({
                "status": "Failed",
                "error": f"SSLyze command failed: {str(e)}",
                "stderr": e.stderr
            }, status=500)

        except Exception as e:
            return Response({
                "status": "Failed",
                "error": str(e)
            }, status=500)
    else:
        return Response({
            "error": "No URL provided"
        }, status=400)
