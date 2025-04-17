from django.contrib import messages
from django.http import HttpResponse, JsonResponse
import random
from datetime import timedelta, datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth import get_user_model
from .forms import EmailForm, OTPForm
from .models import OTPVerification, CustomUser, RavenshawEvent, JobPost
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q

User = get_user_model()  # This will be 'ru.CustomUser' per your AUTH_USER_MODEL

def generate_otp():
    return f"{random.randint(100000, 999999)}"

def index(request):

    upcoming_events = RavenshawEvent.objects.filter(status='upcoming').order_by('-event_date')[:3]  # Get the latest 3 events
    # Pass the events to the template
    context = {
        'upcoming_events': upcoming_events
    }
    return render(request, 'index.html', context)

def about(request):
    return render(request, 'about.html')

def events(request):
    """
    Fetches all events from the database and renders them on the events.html page.
    """
    # Fetch all events from the database
    upcoming_events = RavenshawEvent.objects.all()
    
    # Pass the events to the template
    context = {
        'upcoming_events': upcoming_events
    }
    
    return render(request, 'event.html', context)

def contact(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        email = request.POST.get('email', '').strip()
        message = request.POST.get('message', '').strip()

        # Create a new ContactForm instance
        from .models import ContactForm
        contact_form = ContactForm(
            first_name=first_name,
            last_name=last_name,
            email=email,
            message=message
        )
        contact_form.save()

        messages.success(request, 'Your message has been sent successfully!')
        return redirect('contact')
    else:
        return render(request, 'contact.html')

def login(request):
    """
    Handles user login. The form has fields l-email and l-password.
    """
    if request.method == 'POST':
        email = request.POST.get('l-email', '').strip()
        password = request.POST.get('l-password', '')

        try:
            # Attempt to find a user with that email
            user_obj = User.objects.get(email=email)
            # Now authenticate using the user's username + the provided password
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        if user is not None:
            auth_login(request, user)
            return redirect('dashboard')
        else:
            messages.info(request, 'Invalid credentials')
            return redirect('login')
    else:
        return render(request, 'login.html')

def register(request):
    """
    Handles sending OTP to an email address (AJAX).
    """
    if request.method == 'POST':
        form = EmailForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']

            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'error': 'Email exists'})

            # Otherwise, create OTP & send it
            otp_code = generate_otp()
            OTPVerification.objects.create(email=email, otp_code=otp_code)

            send_mail(
                subject='OTP Verification',
                message=f'Your OTP code is: {otp_code} (expires in 5 minutes)',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
            return JsonResponse({'success': True, 'message': 'OTP sent successfully.'})
        else:
            # form is not valid
            return JsonResponse({'success': False, 'error': 'Invalid email.'})
    
    # If not POST, just render the alumni-registration form or something else
    return render(request, 'alumni-registration.html')

def verify_otp_ajax(request):
    """
    AJAX endpoint to verify OTP. Returns JSON with either error or success + redirect URL.
    """
    if request.method == 'POST':
        email = request.POST.get('email')
        otp_code = request.POST.get('otp_code')
        
        if not email or not otp_code:
            return JsonResponse({'success': False, 'error': 'Missing email or OTP code.'})
        
        try:
            # Grab the most recent OTP for this email that is not verified yet
            otp_record = OTPVerification.objects.filter(email=email, verified=False).latest('created_at')
        except OTPVerification.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'No active OTP for this email. Please request a new one.'})
        
        # Check if expired
        if otp_record.is_expired():
            return JsonResponse({'success': False, 'error': 'OTP code has expired. Please request a new one.'})
        
        # Check if matches
        if otp_record.otp_code != otp_code:
            return JsonResponse({'success': False, 'error': 'Invalid OTP code.'})
        
        # Mark as verified
        otp_record.verified = True
        otp_record.save()
        
        # On success, instruct front-end to go to alumni-registration with email
        redirect_url = f"/alumni-registration?email={email}"
        return JsonResponse({'success': True, 'redirect_url': redirect_url})
    
    return JsonResponse({'success': False, 'error': 'Invalid request method.'})

def alumni_registration_view(request):
    """
    Handles the final user registration after OTP is verified.
    The alumni-registration.html template can auto-fill the ?email= param in an <input>.
    Takes a full name (username) and splits it into first_name and last_name.
    """
    if request.method == 'POST':
        # Retrieve form data
        full_name = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        age = request.POST.get('age', '')
        c_id = request.POST.get('c_id', '')
        batchno = request.POST.get('batchno', '')
        c_name = request.POST.get('c_name', '')
        gender = request.POST.get('gender', '')
        password = request.POST.get('password', '')
        c_password = request.POST.get('c_password', '')

        # Check if passwords match
        if password != c_password:
            messages.info(request, 'Password not matching')
            return redirect('alumni-registration')

        # Split full name into first and last name
        name_parts = full_name.split()
        if len(name_parts) > 0:
            first_name = name_parts[0]
            # Join all remaining parts as last name (if any)
            last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
        else:
            first_name = ''
            last_name = ''

        # Generate a unique username (first_name + 4 random digits)
        import random
        base_username = first_name.lower()
        while True:
            random_digits = ''.join([str(random.randint(0, 9)) for _ in range(4)])
            username = f"{base_username}{random_digits}"
            if not User.objects.filter(username=username).exists():
                break

        # Create user if everything is fine
        user = CustomUser.objects.create_user(
            username=username,  # Generated username
            email=email,
            first_name=first_name,
            last_name=last_name,
            age=age,
            c_id=c_id,
            batchno=batchno,
            c_name=c_name,
            gender=gender,
            password=password
        )

        messages.success(request, 'Registration successful! Please log in.')
        return redirect('login')

    else:
        return render(request, 'alumni-registration.html')

@login_required(login_url='login')
def dashboard(request):
    # Count upcoming events
    upcoming_events = RavenshawEvent.objects.filter(status='upcoming').order_by('event_date')
    
    # Count total events
    total_events = RavenshawEvent.objects.count()
    
    # Count users excluding superusers
    total_users = CustomUser.objects.filter(is_superuser=False).count()
    
    # Get the number of jobs (placeholder as your job functionality isn't implemented yet)
    # Replace this with actual job count when you implement that feature
    total_jobs = JobPost.objects.count()
    
    context = {
        'user': request.user,
        'upcoming_events': upcoming_events,
        'total_events': total_events,
        'total_users': total_users,
        'total_jobs': total_jobs,
    }

    return render(request, 'pf-dashboard.html', context)

@login_required(login_url='index')
def logout(request):
    auth_logout(request)
    return redirect('index')

def forgot_password(request):

    # Handle the initial OTP request
    if request.method == 'POST' and 'action' in request.POST and request.POST['action'] == 'send_otp':
        email = request.POST.get('f-email')

        if not email:
            return JsonResponse({'success': False, 'error': 'Email is required.'})
        
        # Check if the email is registered
        if not User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'error': 'Email not registered.'})
        
        # Generate OTP and send it
        otp_code = generate_otp()
        OTPVerification.objects.create(email=email, otp_code=otp_code)

        send_mail(
            subject='Password Reset OTP',
            message=f'Your OTP code is: {otp_code} (expires in 5 minutes)',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
        )
        return JsonResponse({'success': True, 'message': 'OTP sent successfully.'})
    
    # Handle the OTP verification and password reset
    elif request.method == 'POST' and 'action' in request.POST and request.POST['action'] == 'verify_reset':
        email = request.POST.get('f-email')
        otp_code = request.POST.get('f-otp_code')
        new_password = request.POST.get('f-new_password')
        confirm_password = request.POST.get('f-confirm_password')

        # Validate the input fields
        if not email or not otp_code:
            return JsonResponse({'success': False, 'error': 'Email and OTP code are required.'})
        
        if not new_password or not confirm_password:
            return JsonResponse({'success': False, 'error': 'New password and confirmation are required.'})
        
        if new_password != confirm_password:
            return JsonResponse({'success': False, 'error': 'Passwords do not match.'})
        
        try: # grab the latest OTP for this email that is not verified yet
            otp_record = OTPVerification.objects.filter(email=email, verified=False).latest('created_at')
        except OTPVerification.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'No active OTP for this email. Please request a new one.'})
        
        # if expired
        if otp_record.is_expired():
            return JsonResponse({'success': False, 'error': 'OTP code has expired. Please request a new one.'})
        
        # if matches
        if otp_record.otp_code != otp_code:
            return JsonResponse({'success': False, 'error': 'Invalid OTP code.'})
        
        # mark as verified
        otp_record.verified = True
        otp_record.save()

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()

            return JsonResponse({
                'success': True,
                'message': 'Password reset successfully. You can now log in.',
                'redirect_url': '/login'
            })
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found.'})
        
       
    return render(request, 'forgot-password.html')

@login_required(login_url='login')
def dashboard_profile(request):
    if request.method == 'POST':
        # Handle profile update logic here
        age = request.POST.get('age', '')
        subject = request.POST.get('subject', '')
        phone_no = request.POST.get('phone_no', '')
        c_name = request.POST.get('c_name', '')
        location = request.POST.get('location', '')
        bio = request.POST.get('bio', '')
        
        # Handle social media links
        linkedin = request.POST.get('linkedin', '')
        twitter = request.POST.get('twitter', '')
        github = request.POST.get('github', '')
        other = request.POST.get('other', '')
        
        # Create a dictionary for social links
        social_links = {
            'linkedin': linkedin,
            'twitter': twitter,
            'github': github,
            'other': other,
        }
        
        # Handle profile image upload if present
        if 'profile_img' in request.FILES:
            profile_img = request.FILES['profile_img']
            request.user.profile_img = profile_img

        # Update the user profile
        request.user.age = None if age == '' else age
        request.user.subject = subject
        request.user.Phone_no = None if phone_no == '' else phone_no
        request.user.c_name = c_name
        request.user.location = location
        request.user.bio = bio
        request.user.social_links = social_links  # Now we're setting a proper dictionary
        request.user.save()
        
        messages.success(request, 'Profile updated successfully!')
        return redirect('dashboard-profile')
    else:
        return render(request, 'dashboard-profile.html', {'user': request.user})
    
@login_required(login_url='login')
def dashboard_events(request):
    # Fetch events from the database by status
    ongoing_events = RavenshawEvent.objects.filter(status='ongoing').order_by('event_date')
    upcoming_events = RavenshawEvent.objects.filter(status='upcoming').order_by('event_date')
    completed_events = RavenshawEvent.objects.filter(status='completed').order_by('-event_date')  # Most recent first
    cancelled_events = RavenshawEvent.objects.filter(status='cancelled').order_by('-event_date')  # Most recent first
    
    # Pass the events to the template
    context = {
        'user': request.user,
        'ongoing_events': ongoing_events,
        'upcoming_events': upcoming_events,
        'completed_events': completed_events,
        'cancelled_events': cancelled_events
    }
    
    return render(request, 'dashboard-events.html', context)

@login_required(login_url='login')
def dashboard_network(request):
    # Fetch all users except the current user and admin users
    users = CustomUser.objects.exclude(id=request.user.id).exclude(is_superuser=True)
    
    # Prepare users for template rendering with proper attributes
    user_data = []
    for user in users:
        # Get initials for avatar placeholder
        if user.first_name and user.last_name:
            initials = f"{user.first_name[0]}{user.last_name[0]}".upper()
        elif user.first_name:
            initials = user.first_name[0].upper()
        else:
            initials = user.username[0].upper()
        
        # Handle profile image properly
        profile_img_url = None
        if user.profile_img and hasattr(user.profile_img, 'url'):
            profile_img_url = user.profile_img.url
        elif not user.profile_img or not hasattr(user.profile_img, 'url'):
            # Use the default Cloudinary image URL if profile_img is None or doesn't have a URL
            profile_img_url = "https://res.cloudinary.com/do7vm8vz3/image/upload/v1744881837/default_pf_faq5zi.png"
            
        user_data.append({
            'id': user.id,
            'name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'email': user.email,
            'batchno': user.batchno,
            'subject': user.subject or '',
            'c_name': user.c_name or '',
            'location': user.location or '',
            'profile_img': profile_img_url,
            'initials': initials
        })

    return render(request, 'dashboard-network.html', {
        'user': request.user,  # Current logged-in user for sidebar
        'Users': user_data     # All other users for the network grid
    })

@login_required(login_url='login')
def get_user_profile(request, user_id):
    """API endpoint to get additional user profile details"""
    try:
        user = CustomUser.objects.get(id=user_id)
        
        # Return user data as JSON
        return JsonResponse({
            'success': True,
            'user': {
                'id': user.id,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'email': user.email,
                'batchno': user.batchno,
                'subject': user.subject or '',
                'location': user.location or '',
                'bio': user.bio or '',
                'c_name': user.c_name or '',
                'gender': user.gender or '',
                'is_verified': user.is_verified,
                'social_links': user.social_links
            }
        })
    except CustomUser.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'User not found'
        }, status=404)

@login_required(login_url='login')
def job_post_create(request):
    if request.method == 'POST':
        try:
            job = JobPost(
                title=request.POST['job_title'],
                company_name=request.POST['company_name'],
                location=request.POST['location'],
                employment_type=request.POST['employment_type'],
                experience_level=request.POST['experience_level'],
                description=request.POST['job_description'],
                requirements=request.POST['requirements'],
                salary_range=request.POST['salary_range'],
                application_deadline=request.POST['application_deadline'],
                posted_by=request.user
            )
            job.save()
            messages.success(request, 'Job posted successfully!')
            return redirect('dashboard-jobs')
        except Exception as e:
            messages.error(request, f'Error posting job: {str(e)}')
            return render(request, 'dashboard-job-post.html')
    
    return render(request, 'dashboard-job-post.html')

@login_required(login_url='login')
def job_post_edit(request, job_id):
    job = get_object_or_404(JobPost, id=job_id, posted_by=request.user)
    
    if request.method == 'POST':
        try:
            job.title = request.POST['job_title']
            job.company_name = request.POST['company_name']
            job.location = request.POST['location']
            job.employment_type = request.POST['employment_type']
            job.experience_level = request.POST['experience_level']
            job.description = request.POST['job_description']
            job.requirements = request.POST['requirements']
            job.salary_range = request.POST['salary_range']
            job.application_deadline = request.POST['application_deadline']
            job.save()
            
            messages.success(request, 'Job updated successfully!')
            return redirect('dashboard-jobs')
        except Exception as e:
            messages.error(request, f'Error updating job: {str(e)}')
    
    context = {'job': job}
    return render(request, 'dashboard-job-post.html', context)

@login_required(login_url='login')
def dashboard_jobs(request):
    search_query = request.GET.get('search', '')
    employment_type = request.GET.get('employment_type', '')
    location_type = request.GET.get('location_type', '')
    
    jobs = JobPost.objects.filter(is_active=True)
    
    # Apply filters
    if search_query:
        jobs = jobs.filter(
            Q(title__icontains=search_query) |
            Q(company_name__icontains=search_query) |
            Q(description__icontains=search_query)
        )
    
    if employment_type:
        jobs = jobs.filter(employment_type=employment_type)
    
    if location_type:
        jobs = jobs.filter(location__icontains=location_type)
    
    # Pagination
    paginator = Paginator(jobs, 9)  # Show 9 jobs per page
    page = request.GET.get('page')
    jobs = paginator.get_page(page)
    
    context = {
        'jobs': jobs,
        'search_query': search_query,
        'employment_type': employment_type,
        'location_type': location_type,
    }
    return render(request, 'dashboard-jobs.html', context)
