#!/bin/bash
echo "Building static files..."
pip install -r requirements.txt
python manage.py collectstatic --noinput