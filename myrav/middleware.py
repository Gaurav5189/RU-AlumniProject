class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Add HttpOnly flag to cookies
        if 'csrftoken' in response.cookies:
            response.set_cookie('csrftoken', response.cookies.get('csrftoken').value, httponly=True, samesite='Lax')
        if 'sessionid' in response.cookies:
            response.set_cookie('sessionid', response.cookies.get('sessionid').value, httponly=True, samesite='Lax')
        
        # Add missing security headers
        response['Content-Security-Policy'] = "default-src 'self'; script-src 'self' https://res.cloudinary.com https://cdnjs.cloudflare.com; img-src 'self' https://res.cloudinary.com data: https://do7vm8vz3.cloudinary.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; connect-src 'self';"
        response['X-Content-Type-Options'] = 'nosniff'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
        
        return response