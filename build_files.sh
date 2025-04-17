#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Create staticfiles directory if it doesn't exist
mkdir -p staticfiles

# Debug: Print current directory and list static directory contents
echo "Current directory: $(pwd)"
echo "Static directory contents:"
ls -la static/

# Force collect static without asking for confirmation and with clear option
python manage.py collectstatic --noinput --clear -v 3

# Debug: Print staticfiles directory contents after collection
echo "Staticfiles directory contents after collection:"
ls -la staticfiles/