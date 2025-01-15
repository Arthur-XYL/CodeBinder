from django.urls import path
from .views import DirectoryView, SnippetView

urlpatterns = [
    path('directories/<str:uuid>/', DirectoryView.as_view(), name='directory-list'),
    path('directories/<str:uuid>/<int:id>/', DirectoryView.as_view(), name='directory-detail'),
    path('snippets/<str:uuid>/', SnippetView.as_view(), name='snippet-list'),
    path('snippets/<str:uuid>/<int:id>/', SnippetView.as_view(), name='snippet-detail'),
]