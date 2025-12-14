from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from ru.models import RavenshawEvent, JobPost

User = get_user_model()

class DashboardViewTests(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            username='testuser', 
            password='testpassword', 
            email='test@example.com',
            first_name='Test',
            last_name='User'
        )
        self.client = Client()
        
        # Create dummy data for stats
        RavenshawEvent.objects.create(
            title='Upcoming Event', 
            event_date='2025-12-25', 
            status='upcoming',
            location='Campus',
            description='Test Event'
        )
        
        JobPost.objects.create(
            title='Software Engineer',
            company_name='Tech Corp',
            location='Remote',
            employment_type='Full-time', 
            posted_by=self.user,
            is_active=True
        )

    def test_dashboard_redirects_if_not_logged_in(self):
        response = self.client.get(reverse('dashboard'))
        self.assertNotEqual(response.status_code, 200) 
        # Should redirect to login (302)

    def test_dashboard_loads_for_logged_in_user(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pf-dashboard.html')

    def test_dashboard_context_stats(self):
        self.client.login(username='testuser', password='testpassword')
        response = self.client.get(reverse('dashboard'))
        
        # Check context variables exist
        self.assertIn('total_jobs', response.context)
        self.assertIn('upcoming_events', response.context)
        self.assertIn('total_users', response.context)
        
        # Check values match created data
        self.assertEqual(response.context['total_jobs'], 1)
        self.assertEqual(response.context['upcoming_events'].count(), 1)
        # total_users excludes superusers. We created 1 normal user.
        # Check logic in view: users = CustomUser.objects.filter(is_superuser=False).count()
        self.assertEqual(response.context['total_users'], 1)


class DashboardNetworkTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='viewer', password='password', email='viewer@example.com')
        self.other_user = User.objects.create_user(
            username='alumni1', 
            password='password', 
            email='alumni1@example.com',
            first_name='John',
            last_name='Doe',
            batchno='2020',
            subject='Computer Science',
            c_name='Google'
        )
        self.client = Client()

    def test_network_page_context_structure(self):
        self.client.login(username='viewer', password='password')
        response = self.client.get(reverse('dashboard-network'))
        self.assertEqual(response.status_code, 200)
        
        users_list = response.context['Users']
        self.assertTrue(len(users_list) > 0)
        
        first_user = users_list[0]
        # Check keys that the template uses match the keys in the view's dictionary
        self.assertIn('name', first_user)
        self.assertIn('batchno', first_user)
        self.assertIn('subject', first_user)
        self.assertIn('c_name', first_user)
        self.assertIn('initials', first_user)
        
        # Verify data correctness
        self.assertEqual(first_user['name'], 'John Doe')
        self.assertEqual(first_user['batchno'], '2020')
        self.assertEqual(first_user['subject'], 'Computer Science')
        self.assertEqual(first_user['c_name'], 'Google')


class DashboardAPITests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='apiuser', password='password')
        self.target_user = User.objects.create_user(
            username='target',
            password='password',
            first_name='Target',
            last_name='Person',
            bio='Hello World'
        )
        self.client = Client()

    def test_get_user_profile_api(self):
        self.client.login(username='apiuser', password='password')
        url = reverse('get_user_profile', args=[self.target_user.id])
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        self.assertTrue(data['success'])
        self.assertEqual(data['user']['name'], 'Target Person')
        self.assertEqual(data['user']['bio'], 'Hello World')

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
