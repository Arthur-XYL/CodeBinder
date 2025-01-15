from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView

from .models import Directory, Snippet
from .serializers import DirectorySerializer, SnippetSerializer

class DirectoryView(APIView):
    def get(self, request, uuid, id=None):
        user_filter = {'user_id': uuid}
        if id is None:
            # Fetch top-level directories for the specific user
            directories = Directory.objects.filter(directory=None, **user_filter)
            directory_serializer = DirectorySerializer(directories, many=True)

            # Fetch snippets that don't belong to any directory for the specific user
            standalone_snippets = Snippet.objects.filter(directory=None, **user_filter)
            snippet_serializer = SnippetSerializer(standalone_snippets, many=True)

            response_data = {
                'directory': None,
                'subdirectories': directory_serializer.data,
                'snippets': snippet_serializer.data
            }
            return Response(response_data)
        else:
            directory = get_object_or_404(Directory, id=id, **user_filter)
            subdirectories = Directory.objects.filter(directory_id=id, **user_filter)
            snippets = Snippet.objects.filter(directory_id=id, **user_filter)

            directory_serializer = DirectorySerializer(directory)
            subdirectories_serializer = DirectorySerializer(subdirectories, many=True)
            snippets_serializer = SnippetSerializer(snippets, many=True)

            return Response({
                'directory': directory_serializer.data,
                'subdirectories': subdirectories_serializer.data,
                'snippets': snippets_serializer.data
            })

    def post(self, request, uuid):
        request.data['user_id'] = uuid
        serializer = DirectorySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, uuid, id):
        directory = get_object_or_404(Directory, id=id, user_id=uuid)
        serializer = DirectorySerializer(directory, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, uuid, id):
        directory = get_object_or_404(Directory, id=id, user_id=uuid)
        directory.delete()
        return Response({'message': 'Directory deleted'}, status=status.HTTP_204_NO_CONTENT)

class SnippetView(APIView):
    def get(self, request, uuid, id=None):
        user_filter = {'user_id': uuid}
        snippets = Snippet.objects.filter(**user_filter) if id is None else [get_object_or_404(Snippet, id=id, **user_filter)]
        serializer = SnippetSerializer(snippets, many=id is None)
        return Response(serializer.data)

    def post(self, request, uuid):
        request.data['user_id'] = uuid
        serializer = SnippetSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    def patch(self, request, uuid, id):
        snippet = get_object_or_404(Snippet, id=id, user_id=uuid)
        serializer = SnippetSerializer(snippet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

    def delete(self, request, uuid, id):
        snippet = get_object_or_404(Snippet, id=id, user_id=uuid)
        snippet.delete()
        return Response({'message': 'Snippet deleted'}, status=status.HTTP_204_NO_CONTENT)
