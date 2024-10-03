from rest_framework.decorators import api_view
from rest_framework.response import Response

# Access to global progress dictionary from the combined scan view
from .combined_scan import scan_progress  

@api_view(['GET'])
def get_progress(request, scan_id):
    """
    Get the current progress of the scan based on scan_id.
    """
    progress = scan_progress.get(scan_id, 0)
    return Response({
        'progress': progress
    })
