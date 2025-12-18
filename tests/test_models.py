import pytest
from django.utils import timezone
from ru.models import CustomUser, JobPost, RavenshawEvent
from datetime import timedelta

@pytest.mark.django_db
def test_create_user():
    user = CustomUser.objects.create_user(username='testuser', password='password123')
    assert user.username == 'testuser'
    assert user.check_password('password123')
    assert not user.is_staff
    assert not user.is_superuser

@pytest.mark.django_db
def test_job_post_expiration():
    # Create a user for posting jobs
    user = CustomUser.objects.create_user(username='job_poster', password='password123')

    # Job pending
    job_active = JobPost.objects.create(
        title="Active Job",
        description="Desc",
        company_name="Comp",
        location="Loc",
        application_deadline=timezone.now().date() + timedelta(days=5),
        posted_by=user,
        requirements="Reqs"
    )
    assert not job_active.is_expired()

    # Job expired
    job_expired = JobPost.objects.create(
        title="Expired Job",
        description="Desc",
        company_name="Comp",
        location="Loc",
        application_deadline=timezone.now().date() - timedelta(days=1),
        posted_by=user,
        requirements="Reqs"
    )
    assert job_expired.is_expired()

@pytest.mark.django_db
def test_event_defaults():
    event = RavenshawEvent.objects.create(
        event_name="Test Event",
        event_date=timezone.now(),
        event_location="Campus"
    )
    assert event.event_name == "Test Event"
