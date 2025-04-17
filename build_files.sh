#!/bin/bash
# Install Python dependencies
pip install -r requirements.txt

# Create a dummy file in staticfiles to prevent "empty directory" error
mkdir -p staticfiles/css
echo "/* Placeholder CSS file */" > staticfiles/css/base.css

# Debug: Print staticfiles directory contents after collection
echo "Staticfiles directory contents after adding placeholder:"
ls -la staticfiles/

# Try collecting static files (but don't fail if it doesn't work)
python manage.py collectstatic --noinput || echo "Collectstatic failed, but continuing deployment"