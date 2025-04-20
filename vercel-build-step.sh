#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Copy admin static files directly to the static directory
python build_admin_static.py

# Run collectstatic with clear to ensure clean collection
python manage.py collectstatic --noinput --clear

# now mirror it into static/ so Vercel’s @vercel/static sees it:
cp -a staticfiles/. static/