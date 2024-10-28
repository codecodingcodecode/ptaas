import subprocess
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import re

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

            # Nikto raw output
            nikto_output = nikto_result.stdout

            # Format the output
            formatted_result = format_nikto_output(nikto_output)

            return Response({
                "status": "Completed",
                "result": formatted_result
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


def format_nikto_output(nikto_output):
    # Extract details from the raw output using regex or text parsing
    result = {
        "version": re.search(r'Nikto v[0-9.]+', nikto_output).group(0) if re.search(r'Nikto v[0-9.]+', nikto_output) else "Unknown",
        "multiple_ips_found": re.findall(r'Multiple IPs found: (.+)', nikto_output),
        "target": {
            "ip": re.search(r'Target IP:\s+([0-9a-fA-F:.]+)', nikto_output).group(1) if re.search(r'Target IP:\s+([0-9a-fA-F:.]+)', nikto_output) else "Unknown",
            "hostname": re.search(r'Target Hostname:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Target Hostname:\s+([^\n]+)', nikto_output) else "Unknown",
            "port": re.search(r'Target Port:\s+([0-9]+)', nikto_output).group(1) if re.search(r'Target Port:\s+([0-9]+)', nikto_output) else "Unknown"
        },
        "ssl_info": {
            "subject": re.search(r'Subject:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Subject:\s+([^\n]+)', nikto_output) else "Unknown",
            "altnames": re.search(r'Altnames:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Altnames:\s+([^\n]+)', nikto_output) else "Unknown",
            "ciphers": re.search(r'Ciphers:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Ciphers:\s+([^\n]+)', nikto_output) else "Unknown",
            "issuer": re.search(r'Issuer:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Issuer:\s+([^\n]+)', nikto_output) else "Unknown"
        },
        "server": re.search(r'Server:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Server:\s+([^\n]+)', nikto_output) else "Unknown",
        "start_time": re.search(r'Start Time:\s+([^\n]+)', nikto_output).group(1) if re.search(r'Start Time:\s+([^\n]+)', nikto_output) else "Unknown",
        "vulnerabilities": [],
        "scan_summary": {
            "termination_info": re.search(r'Scan terminated: (.+)', nikto_output).group(1) if re.search(r'Scan terminated: (.+)', nikto_output) else "Unknown",
            "end_time": re.search(r'End Time:\s+([^\n]+)', nikto_output).group(1) if re.search(r'End Time:\s+([^\n]+)', nikto_output) else "Unknown",
            "duration": "Unknown"
        },
        "hosts_tested": re.search(r'[0-9]+ host\(s\) tested', nikto_output).group(0) if re.search(r'[0-9]+ host\(s\) tested', nikto_output) else "Unknown"
    }

    # Find all vulnerabilities
    vulnerability_lines = re.findall(r'^\+ /[^\n]+', nikto_output, re.MULTILINE)
    for line in vulnerability_lines:
        vuln = {
            "description": line[2:].strip(),
            "link": ""
        }
        # Try to extract a reference link if available
        link_match = re.search(r'See: (https?://[^\s]+)', line)
        if link_match:
            vuln["link"] = link_match.group(1)
        result["vulnerabilities"].append(vuln)

    return result
