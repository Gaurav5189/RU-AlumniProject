from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from cloudinary_storage.storage import MediaCloudinaryStorage


class CustomUser(AbstractUser):
    age = models.PositiveIntegerField(null=True)
    c_id = models.CharField(max_length=20)
    batchno = models.CharField(max_length=20)
    c_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=20, blank=True)
    profile_img = models.ImageField(upload_to='profile_images/', default="default_pf.png")
    Phone_no = models.CharField(max_length=15, null=True, blank=True)
    location = models.TextField(default='', blank=True)
    bio = models.TextField(default='', blank=True)  # or some other appropriate default
    subject = models.CharField(max_length=100, default='', blank=True)
    # Update this line - make sure a default empty dict is provided
    social_links = models.JSONField(default=dict, blank=True, null=False)  # Store social links as JSON
    is_verified = models.BooleanField(default=False)  # New field to track verification status

class OTPVerification(models.Model):
    email = models.EmailField()
    otp_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    verified = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"{self.email} - {self.otp_code}"
    

class RavenshawEvent(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    
    event_name = models.CharField(max_length=200)
    event_date = models.DateTimeField()
    event_location = models.CharField(max_length=200)
    event_description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Tracks when the event was last modified
    event_img = models.ImageField(upload_to='event_images/', default="#")
    
    class Meta:
        ordering = ['-event_date']
        verbose_name = 'Ravenshaw Event'
        verbose_name_plural = 'Ravenshaw Events'
    
    def __str__(self):
        return self.event_name
    
class JobPost(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ('full-time', 'Full-time'),
        ('part-time', 'Part-time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
    ]
    
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('executive', 'Executive'),
    ]

    title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    employment_type = models.CharField(
        max_length=20,
        choices=EMPLOYMENT_TYPE_CHOICES,
        default='full-time'
    )
    experience_level = models.CharField(
        max_length=20,
        choices=EXPERIENCE_LEVEL_CHOICES,
        default='entry'
    )
    description = models.TextField()
    requirements = models.TextField()
    salary_range = models.CharField(max_length=100, blank=True, null=True)
    application_deadline = models.DateField()
    
    # Update this line to use settings.AUTH_USER_MODEL
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} at {self.company_name}"
    
    def is_expired(self):
        return self.application_deadline < timezone.now().date()
    
    def days_until_deadline(self):
        delta = self.application_deadline - timezone.now().date()
        return delta.days

class ContactForm(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class TestImage(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='test_images/', storage=MediaCloudinaryStorage())

