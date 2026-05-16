from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    """
    GET /api/notifications/
    Returns notifications for the logged in user.
    Supports ?unread=true filter.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(user=self.request.user)
        unread_only = self.request.query_params.get('unread', 'false').lower() == 'true'
        if unread_only:
            queryset = queryset.filter(read=False)
        return queryset


class NotificationReadView(generics.UpdateAPIView):
    """
    PUT /api/notifications/<uuid:pk>/read/
    Marks a single notification as read.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.read = True
        instance.save(update_fields=['read'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class NotificationReadAllView(APIView):
    """
    PUT /api/notifications/read-all/
    Marks all notifications for the user as read.
    """
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        Notification.objects.filter(user=request.user, read=False).update(read=True)
        return Response({"detail": "All notifications marked as read."}, status=status.HTTP_200_OK)
