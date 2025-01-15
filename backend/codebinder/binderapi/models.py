from django.db import models

# Create your models here.
class Directory(models.Model):
    user_id = models.CharField(max_length=64, db_index=True)
    name = models.CharField(max_length=100)
    directory = models.ForeignKey('self', null=True, related_name='subdirectories', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (User ID: {self.user_id})"

class Snippet(models.Model):
    user_id = models.CharField(max_length=64, db_index=True)
    directory = models.ForeignKey(Directory, null=True, related_name='snippets', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} (User ID: {self.user_id})"