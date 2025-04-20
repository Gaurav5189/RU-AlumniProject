def csp_nonce(request):
    """Add CSP nonce to template context"""
    return {
        'csp_nonce': getattr(request, 'csp_nonce', ''),
    }