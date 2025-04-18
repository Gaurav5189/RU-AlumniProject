#!/usr/bin/env python
import os
import shutil
from django.core.management import call_command
from django.contrib import admin
from django.conf import settings
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myrav.settings')
django.setup()

# Create a temporary directory for admin static files
temp_dir = 'admin_static_temp'
if os.path.exists(temp_dir):
    shutil.rmtree(temp_dir)
os.makedirs(temp_dir)

# Get the admin static files directory
admin_static_path = os.path.join(os.path.dirname(admin.__file__), 'static', 'admin')

# Copy admin static files to the temporary directory
shutil.copytree(admin_static_path, os.path.join(temp_dir, 'admin'))

# Ensure the static directory exists in the project root
static_dir = os.path.join(settings.BASE_DIR, 'static')
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

# Copy the admin static files to the project's static directory
admin_dest = os.path.join(static_dir, 'admin')
if os.path.exists(admin_dest):
    shutil.rmtree(admin_dest)
shutil.copytree(os.path.join(temp_dir, 'admin'), admin_dest)

# Clean up the temporary directory
shutil.rmtree(temp_dir)

print("Admin static files have been copied to your project's static directory.")