import subprocess
import re
import json
import xmltodict
from rest_framework.decorators import api_view
from rest_framework.response import Response
import os

@api_view(['POST'])
def nmap_scan(request):
    url = request.data.get('url')
    if url:
        try:
            # Clean the URL to remove 'http' or 'https'
            cleaned_url = re.sub(r'^https?://', '', url)
            
            # Nmap command to scan ports 22, 80, and 443
            nmap_command = [
                'nmap', '-p', '80,443,22', '-sV', '-T4', '-oX', '-', cleaned_url
            ]
            
            # Suppress Python warnings
            os.environ['PYTHONWARNINGS'] = 'ignore'

            # Run the Nmap command
            nmap_result = subprocess.run(
                nmap_command,
                capture_output=True, text=True, check=True
            )
            
            raw_output = nmap_result.stdout  # XML output from Nmap

            # Parse the XML output to JSON using xmltodict
            try:
                parsed_output = xmltodict.parse(raw_output)  # Convert XML to dict
            except Exception as e:
                return Response({
                    "status": "Failed",
                    "error": f"Failed to parse XML: {str(e)}",
                    "raw_output": raw_output
                }, status=500)
            
            # Convert parsed dict to JSON format
            json_output = json.loads(json.dumps(parsed_output))

            # Return the JSON-formatted output
            return Response({
                "status": "Completed",
                "result": json_output
            }, status=200)

        except subprocess.CalledProcessError as e:
            return Response({
                "status": "Failed",
                "error": f"Nmap command failed: {str(e)}",
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
