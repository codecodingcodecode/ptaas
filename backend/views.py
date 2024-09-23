from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

import subprocess
import re

def clean_url(url):
    """
    Cleans the URL by removing the scheme (http, https) and default port.
    """
    # Remove http:// or https://
    clean_url = re.sub(r'^https?://', '', url)
    
    # Append port 443 if not provided, assuming SSL is tested on HTTPS port by default.
    if ':' not in clean_url:
        clean_url = f"{clean_url}:443"
    
    return clean_url

@api_view(['POST'])
def start_test(request):
    """
    Start a new penetration test using Nmap, Nikto, SSLyze, Wapiti, and SQLMap.
    """
    url = request.data.get('url')
    if url:
        results = {}
        try:
            # Clean the URL for SSLyze (remove http/https and ensure port is added)
            cleaned_url = clean_url(url)
            
            # Nmap Scan
            try:
                nmap_result = subprocess.run(['nmap', '-Pn', '-p-', url], capture_output=True, text=True)
                results['Nmap Results'] = nmap_result.stdout
            except Exception as e:
                results['Nmap Results'] = f"Error: {str(e)}"
            
            # Nikto Scan
            try:
                nikto_result = subprocess.run(['nikto', '-h', url], capture_output=True, text=True)
                results['Nikto Results'] = nikto_result.stdout
            except Exception as e:
                results['Nikto Results'] = f"Error: {str(e)}"
            
            # SSLyze Scan
            try:
                sslyze_result = subprocess.run(['sslyze', cleaned_url], capture_output=True, text=True)
                results['SSLyze Results'] = sslyze_result.stdout
            except Exception as e:
                results['SSLyze Results'] = f"Error: {str(e)}"

            # SQLMap Scan with crawling
            try:
                sqlmap_result = subprocess.run(['sqlmap', '-u', url, '--random-agent', '--level=5', '--risk=3', '--crawl=2', '--batch'], capture_output=True, text=True)
                results['SQLMap Results'] = sqlmap_result.stdout
            except Exception as e:
                results['SQLMap Results'] = f"Error: {str(e)}"

            # Wapiti Scan
            try:
                wapiti_result = subprocess.run(['wapiti', url], capture_output=True, text=True)
                results['Wapiti Results'] = wapiti_result.stdout
            except Exception as e:
                results['Wapiti Results'] = f"Error: {str(e)}"

            # Return the combined results
            return Response({
                "status": "Completed",
                "result": results
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Global error handling
            return Response({
                "status": "Failed",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({
            "error": "No URL provided"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_tests(request):
    """
    Retrieve all penetration tests (currently just a placeholder, since no database).
    """
    return Response({
        "message": "No database implemented yet."
    }, status=status.HTTP_200_OK)
