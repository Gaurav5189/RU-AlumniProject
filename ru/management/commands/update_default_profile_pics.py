from django.core.management.base import BaseCommand
from ru.models import CustomUser

class Command(BaseCommand):
    help = 'Updates ALL users with the default profile image'

    def handle(self, *args, **options):
        # Get all users
        all_users = CustomUser.objects.all()
        count = all_users.count()
        
        # Set default cloudinary image
        default_img = "https://res.cloudinary.com/do7vm8vz3/image/upload/v1744881837/default_pf_faq5zi.png"
        
        # Update every user's profile image
        for user in all_users:
            user.profile_img = default_img
            user.save()
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {count} users with default profile images'))