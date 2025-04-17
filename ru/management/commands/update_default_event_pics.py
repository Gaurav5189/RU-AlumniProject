from django.core.management.base import BaseCommand
from ru.models import RavenshawEvent

class Command(BaseCommand):
    help = 'Updates ALL users with the default profile image'

    def handle(self, *args, **options):
        # Get all users
        events = RavenshawEvent.objects.all()
        count = events.count()
        
        # Set default cloudinary image
        default_img = "https://res.cloudinary.com/do7vm8vz3/image/upload/v1744900889/WhatsApp_Image_2025-04-17_at_8.03.06_PM_ie50i3.jpg"
        
        # Update every events image
        for e in events:
            e.event_img = default_img
            e.save()
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {count} users with default profile images'))