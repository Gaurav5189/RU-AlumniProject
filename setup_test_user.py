import os
import django
import sys

# Add project root to path
sys.path.append(os.getcwd())

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myrav.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
username = 'browsertest'
email = 'browsertest@example.com'
password = 'pass123'

try:
    u = User.objects.filter(username=username)
    if u.exists():
        u.delete()
        print(f"Deleted existing user {username}")
except Exception as e:
    print(e)

User.objects.create_user(
    username=username,
    email=email,
    password=password,
    first_name='Browser',
    last_name='Test',
    c_id='TEST001',
    batchno='2020',
    c_name='Test Company',
    gender='Male'
)
print(f"Created user {username}")
