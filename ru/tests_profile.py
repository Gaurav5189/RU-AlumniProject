from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model

User = get_user_model()

class ProfileUpdateTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='profiletest', 
            password='password', 
            email='profile@example.com'
        )
        self.client = Client()
        self.client.login(username='profiletest', password='password')

    def test_profile_update_post(self):
        url = reverse('dashboard-profile')
        data = {
            'bio': 'Updated Bio via Unit Test',
            'location': 'Unit Test City',
            'phone_no': '1234567890',
            'subject': 'Test Subject',
            'c_name': 'Test Corp'
        }
        response = self.client.post(url, data, follow=True)
        self.assertEqual(response.status_code, 200)
        
        # Reload user from DB
        self.user.refresh_from_db()
        self.assertEqual(self.user.bio, 'Updated Bio via Unit Test')
        self.assertEqual(self.user.location, 'Unit Test City')
        self.assertEqual(self.user.Phone_no, '1234567890')
        self.assertEqual(self.user.subject, 'Test Subject')
        self.assertEqual(self.user.c_name, 'Test Corp')
