import pytest
from django.urls import reverse

@pytest.mark.django_db
class TestPublicViews:
    def test_public_index_view(self, client):
        url = reverse('index')
        response = client.get(url)
        assert response.status_code == 200
        assert "index.html" in [t.name for t in response.templates]

@pytest.mark.django_db
class TestProtectedViews:
    def test_dashboard_access_denied_anonymous(self, client):
        url = reverse('dashboard')
        response = client.get(url)
        # Should redirect to login
        assert response.status_code == 302
        assert "/login" in response.url
