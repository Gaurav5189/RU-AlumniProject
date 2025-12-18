from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, OTPVerification, RavenshawEvent, JobPost, ContactForm

class CustomUserAdmin(UserAdmin):
    # Add your custom fields to the list_display
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_company_name', 'get_college_id', 'batchno', 'subject', 'social_links',
                    'is_verified')
    
    # Add fieldsets for the custom fields with custom labels
    def get_fieldsets(self, request, obj=None):
        # Get the original fieldsets
        fieldsets = super().get_fieldsets(request, obj)
        
        # Add custom fields with proper labels
        custom_fieldsets = fieldsets + (
            ('Custom Fields', {'fields': (
                'age', 
                'subject', 
                ('c_id', 'batchno'),  # Grouped fields
                'c_name', 
                'gender',
                'profile_img', 
                'Phone_no', 
                'location', 
                'bio', 
                'social_links', 
                'is_verified'
            )}),
        )
        return custom_fieldsets

    def formfield_for_dbfield(self, db_field, **kwargs):
        field = super().formfield_for_dbfield(db_field, **kwargs)
        if db_field.name == 'c_id':
            field.label = 'College ID'
        elif db_field.name == 'c_name':
            field.label = 'Company Name'
        return field

    def get_company_name(self, obj):
        return obj.c_name
    get_company_name.short_description = 'Company Name'
    get_company_name.admin_order_field = 'c_name'

    def get_college_id(self, obj):
        return obj.c_id
    get_college_id.short_description = 'College ID'
    get_college_id.admin_order_field = 'c_id'

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
