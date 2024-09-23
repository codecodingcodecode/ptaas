from django.http import HttpResponse
from django.urls import path
from . import views

def index(request):
    return HttpResponse("Willkommen zu PTaaS")

urlpatterns = [
    path('', index),  # Root-URL für die Startseite
    path('api/start-test/', views.start_test, name='start_test'),
    path('api/tests/', views.get_tests, name='get_tests'),
]
