from django.urls import path
from .views import ConversationListView, MessageListView

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation-list'),
    path('<uuid:conversation_id>/messages/', MessageListView.as_view(), name='message-list'),
]
