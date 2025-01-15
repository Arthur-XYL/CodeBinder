from rest_framework import serializers
from .models import Directory, Snippet

class DirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory
        fields = ['id', 'user_id', 'directory', 'name', 'created_at', 'updated_at']
        read_only_fields = ['user_id']

    def create(self, validated_data):
        validated_data['user_id'] = self.context['request'].data['user_id']
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = ['id', 'user_id', 'directory', 'name', 'content', 'created_at', 'updated_at']
        read_only_fields = ['user_id']

    def create(self, validated_data):
        validated_data['user_id'] = self.context['request'].data['user_id']
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)
