#!/bin/bash
# Install dependencies
pip install -r requirements.txt

# Run migrations if needed
# python manage.py migrate

# Run collectstatic
python manage.py collectstatic --noinput