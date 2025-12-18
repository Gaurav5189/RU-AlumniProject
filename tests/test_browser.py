import os
import pytest
from playwright.sync_api import Page, expect

# Allow sync ORM access in async context for Playwright
os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

@pytest.mark.django_db(transaction=True)
def test_home_page_e2e(page: Page, live_server):
    page.goto(live_server.url)
    expect(page).to_have_title("Ravenshaw Alumni System")
    expect(page.locator("h1").first).to_contain_text("Welcome To official Alumni Network")

@pytest.mark.django_db(transaction=True)
def test_login_flow_e2e(page: Page, live_server, django_user_model):
    # Create test user
    user = django_user_model.objects.create_user(
        username='browsertest_e2e',
        email='browser@test.com',
        password='password123'
    )
    
    page.goto(f"{live_server.url}/login/")
    
    # Fill login form
    # Note: Using specific selectors based on login.html structure
    page.fill("input[name='l-email']", "browser@test.com")
    page.fill("input[name='l-password']", "password123")
    
    # Click sign in button inside the sign-in-container
    page.click(".sign-in-container button")
    
    # Expect redirect to dashboard
    expect(page).to_have_url(f"{live_server.url}/dashboard/")
    expect(page.locator(".sidebar")).to_be_visible()
