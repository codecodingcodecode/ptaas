from django.urls import path
from .views import nmap_scan, nikto_scan, sslyze_scan, sqlmap_scan, wapiti_scan, combined_scan

urlpatterns = [
    path('nmap-scan/', nmap_scan, name='nmap-scan'),
    path('nikto-scan/', nikto_scan, name='nikto-scan'),
    path('sslyze-scan/', sslyze_scan, name='sslyze-scan'),
    path('sqlmap-scan/', sqlmap_scan, name='sqlmap-scan'),
    path('wapiti-scan/', wapiti_scan, name='wapiti-scan'),
    path('combined-scan/', combined_scan, name='combined-scan'),  # Neuer kombinierter Scan-Endpunkt
]
