import secrets
from django.conf import settings
from django.utils.crypto import get_random_string

class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Generate a random nonce value for this request
        nonce = get_random_string(length=16)
        request.csp_nonce = nonce
        
        response = self.get_response(request)
        
        # Add security headers
        response["X-Content-Type-Options"] = "nosniff"
        response["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        response["Referrer-Policy"] = "no-referrer"
        
        # Cookie settings remain the same
        for cookie_name in ('csrftoken', 'sessionid'):
            if cookie_name in response.cookies:
                cookie = response.cookies[cookie_name]
                response.set_cookie(
                    cookie_name,
                    cookie.value,
                    httponly=True,
                    samesite='Lax',
                    secure=not settings.DEBUG
                )

        return response