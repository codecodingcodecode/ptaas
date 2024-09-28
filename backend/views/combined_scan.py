from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests

@api_view(['POST'])
def combined_scan(request):
    url = request.data.get('url')
    
    if url:
        try:
            base_api_url = 'http://127.0.0.1:8000/'  # Base URL for all API calls

            # Call Nmap API
            nmap_response = requests.post(f'{base_api_url}/nmap-scan/', json={'url': url})
            nmap_result = nmap_response.json().get('result', 'Nmap failed')

            # Call Nikto API
            nikto_response = requests.post(f'{base_api_url}/nikto-scan/', json={'url': url})
            nikto_result = nikto_response.json().get('result', 'Nikto failed')

            # Call SSLyze API
            sslyze_response = requests.post(f'{base_api_url}/sslyze-scan/', json={'url': url})
            sslyze_result = sslyze_response.json().get('result', 'SSLyze failed')

            # Call SQLMap API
            sqlmap_response = requests.post(f'{base_api_url}/sqlmap-scan/', json={'url': url})
            sqlmap_result = sqlmap_response.json().get('result', 'SQLMap failed')

            # Call Wapiti API
            wapiti_response = requests.post(f'{base_api_url}/wapiti-scan/', json={'url': url})
            wapiti_result = wapiti_response.json().get('result', 'Wapiti failed')

            # Combine results into a single response
            combined_results = {
                'Nmap Results': nmap_result,
                'Nikto Results': nikto_result,
                'SSLyze Results': sslyze_result,
                'SQLMap Results': sqlmap_result,
                'Wapiti Results': wapiti_result,
            }

            return Response({
                'status': 'Completed',
                'results': combined_results
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
