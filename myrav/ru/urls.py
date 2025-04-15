from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    #path('events/', views.events, name='events'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('verify-otp-ajax/', views.verify_otp_ajax, name='verify-otp-ajax'),
    path('alumni-registration/', views.alumni_registration_view, name='alumni-registration'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('logout/', views.logout, name='logout'),
    path('forgot-password/', views.forgot_password, name='forgot-password'),
    path('dashboard-profile/', views.dashboard_profile, name='dashboard-profile'),
    path('dashboard-events/', views.dashboard_events, name='dashboard-events'),
    path('dashboard-network/', views.dashboard_network, name='dashboard-network'),
    path('api/user/<int:user_id>/', views.get_user_profile, name='get_user_profile'),
    path('dashboard/jobs/', views.dashboard_jobs, name='dashboard-jobs'),
    path('dashboard/jobs/post/', views.job_post_create, name='job-post-create'),
    path('dashboard/jobs/edit/<int:job_id>/', views.job_post_edit, name='job-post-edit'),
   
]