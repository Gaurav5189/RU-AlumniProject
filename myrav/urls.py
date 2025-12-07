from django.contrib import admin  # type: ignore
from django.urls import path, include  # type: ignore
from django.conf import settings  # type: ignore
from django.conf.urls.static import static  # type: ignore

# --- IMPORTS FOR SITEMAP ---
from django.contrib.sitemaps.views import sitemap
from ru.sitemaps import StaticViewSitemap  # your app is named "ru"

sitemaps = {
    'static': StaticViewSitemap,
}

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('ru.urls')),

    # --- SITEMAP URL ---
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django_sitemap'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
