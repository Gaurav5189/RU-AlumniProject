class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Ensure HttpOnly and SameSite are set for cookies
        for cookie_name in ('csrftoken', 'sessionid'):
            if cookie_name in response.cookies:
                cookie = response.cookies[cookie_name]
                response.set_cookie(
                    cookie_name,
                    cookie.value,
                    httponly=True,
                    samesite='Lax'
                )

        return response
