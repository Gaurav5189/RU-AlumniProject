from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from .models import RavenshawEvent

class IndexViewTest(TestCase):
    def setUp(self):
        # Create some upcoming events for testing
        self.event1 = RavenshawEvent.objects.create(
            event_name="Upcoming Event 1",
            event_date=timezone.now() + timezone.timedelta(days=5),
            event_location="Location 1",
            event_description="Description 1",
            status='upcoming'
        )
        self.event2 = RavenshawEvent.objects.create(
            event_name="Upcoming Event 2",
            event_date=timezone.now() + timezone.timedelta(days=10),
            event_location="Location 2",
            event_description="Description 2",
            status='upcoming'
        )
        # Create a past event (should not be in upcoming list if filtered correctly, 
        # but view logic says status='upcoming', so date might not automate status change without other logic.
        # However, we test explicit 'upcoming' status retrieval)

    def test_index_page_status_code(self):
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, 200)

    def test_index_page_uses_correct_template(self):
        response = self.client.get(reverse('index'))
        self.assertTemplateUsed(response, 'index.html')

    def test_index_page_contains_upcoming_events(self):
        response = self.client.get(reverse('index'))
        self.assertIn('upcoming_events', response.context)
        self.assertEqual(len(response.context['upcoming_events']), 2)
        self.assertContains(response, self.event1.event_name)
        self.assertContains(response, self.event2.event_name)
