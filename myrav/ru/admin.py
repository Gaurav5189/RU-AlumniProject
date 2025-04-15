from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OTPVerification, RavenshawEvent, JobPost, ContactForm

class CustomUserAdmin(UserAdmin):
    # Add your custom fields to the list_display
    list_display = ('username', 'email', 'first_name', 'last_name', 'c_name', 'c_id', 'batchno', 'subject', 'social_links',
                    'is_verified')
    
    # Add fieldsets for the custom fields
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('age', 'subject', 'c_id', 'batchno', 'c_name', 'gender', 
                                    'profile_img', 'Phone_no', 'location', 'bio', 'social_links', 'is_verified')}),
    )

class RavenshawEventAdmin(admin.ModelAdmin):
    list_display = ('event_name', 'event_date', 'event_img', 'event_location', 'status', 'created_at')
    list_display_links = ('event_name',)
    search_fields = ('event_name', 'event_location', 'event_description')
    list_filter = ('status', 'event_date')
    date_hierarchy = 'event_date'
    ordering = ('-event_date',)
    
    fieldsets = (
        ('Event Information', {
            'fields': ('event_name', 'event_description')
        }),
        ('Date and Location', {
            'fields': ('event_date', 'event_location')
        }),
        ('Status', {
            'fields': ('status',)
        })
    )

class ContactFormAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'created_at')
    list_display_links = ('first_name', 'last_name')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)

# Register the ContactForm model (assuming you have a ContactForm model defined)
admin.site.register(ContactForm, ContactFormAdmin)

# Register with the custom admin class
admin.site.register(CustomUser, CustomUserAdmin)

# Also register your OTPVerification model
admin.site.register(OTPVerification)

# Register the RavenshawEvent model
admin.site.register(RavenshawEvent)

# Register the JobPost model
@admin.register(JobPost)
class JobPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'employment_type', 'location', 
                   'application_deadline', 'is_active', 'posted_by', 'created_at')
    list_filter = ('employment_type', 'experience_level', 'is_active', 'created_at')
    search_fields = ('title', 'company_name', 'description', 'requirements')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'company_name', 'location', 'posted_by')
        }),
        ('Job Details', {
            'fields': ('employment_type', 'experience_level', 'description', 
                      'requirements', 'salary_range')
        }),
        ('Status', {
            'fields': ('application_deadline', 'is_active')
        }),
    )
