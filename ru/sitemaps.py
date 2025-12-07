from django.contrib.sitemaps import Sitemap
from django.urls import reverse

class StaticViewSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return [
            'index',
            'about',
            'contact',
            'events',
            'login',
            'register',
            'forgot-password',
            'dashboard',
            'dashboard-profile',
            'dashboard-events',
            'dashboard-network',
        ]

    def location(self, item):
        return reverse(item)
