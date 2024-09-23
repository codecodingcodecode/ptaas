from rest_framework import serializers
from .models import PenetrationTest

class PenetrationTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PenetrationTest
        fields = '__all__'
