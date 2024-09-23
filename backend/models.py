from django.db import models

class PenetrationTest(models.Model):
    url = models.URLField(max_length=200)
    status = models.CharField(max_length=100, default='Pending')
    result = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'backend'

    def __str__(self):
        return f"{self.url} - {self.status}"
