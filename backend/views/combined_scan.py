from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt  # Add this import
import requests
import time

# Store progress globally for simplicity; in real systems, use Redis or a DB
scan_progress = {}

@csrf_exempt  # Exempt CSRF for this API view
@api_view(['POST'])
def combined_scan(request):
    url = request.data.get('url')
    
    if url:
        try:
            base_api_url = 'http://127.0.0.1:8000/'  # Base URL for all API calls
            scan_id = "scan_" + str(int(time.time()))  # Create a unique scan ID
            scan_progress[scan_id] = 0  # Initialize progress

            # Add Debug print statement
            print(f"Starting scan with scan_id: {scan_id}")
            
            # Call Nmap API (20% progress)
            nmap_response = requests.post(f'{base_api_url}/nmap-scan/', json={'url': url})
            nmap_result = nmap_response.json().get('result', 'Nmap failed')
            scan_progress[scan_id] = 20

            # Call Nikto API (40% progress)
            nikto_response = requests.post(f'{base_api_url}/nikto-scan/', json={'url': url})
            nikto_result = nikto_response.json().get('result', 'Nikto failed')
            scan_progress[scan_id] = 40

            # Call SSLyze API (60% progress)
            sslyze_response = requests.post(f'{base_api_url}/sslyze-scan/', json={'url': url})
            sslyze_result = sslyze_response.json().get('result', 'SSLyze failed')
            scan_progress[scan_id] = 60

            # Call SQLMap API (80% progress)
            sqlmap_response = requests.post(f'{base_api_url}/sqlmap-scan/', json={'url': url})
            sqlmap_result = sqlmap_response.json().get('result', 'SQLMap failed')
            scan_progress[scan_id] = 80

            # Call Wapiti API (100% progress)
            wapiti_response = requests.post(f'{base_api_url}/wapiti-scan/', json={'url': url})
            wapiti_result = wapiti_response.json().get('result', 'Wapiti failed')
            scan_progress[scan_id] = 100

            # Combine results into a single response
            combined_results = {
                'Nmap Results': nmap_result,
                'Nikto Results': nikto_result,
                'SSLyze Results': sslyze_result,
                'SQLMap Results': sqlmap_result,
                'Wapiti Results': wapiti_result,
            }

            del scan_progress[scan_id]  # Clear progress after scan is complete

            # Add Debug print statement to verify response
            print(f"Returning scan_id: {scan_id}")
            return Response({
                'status': 'Completed',
                'results': combined_results,
                'scan_id': scan_id,  # Return the scan ID for progress tracking
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'status': 'Failed',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response({
            'error': 'No URL provided'
        }, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt  # Exempt CSRF for this API view
@api_view(['GET'])
def get_progress(request, scan_id):
    """
    Get the current progress of the scan based on scan_id.
    """
    progress = scan_progress.get(scan_id, 0)
    return Response({
        'progress': progress
    }, status=status.HTTP_200_OK)
