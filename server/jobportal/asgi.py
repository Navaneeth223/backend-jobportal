import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jobportal.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
import messaging.routing

application = ProtocolTypeRouter({
    'http':      get_asgi_application(),
    'websocket': AllowedHostsOriginValidator(
        URLRouter(
            messaging.routing.websocket_urlpatterns
        )
    ),
})