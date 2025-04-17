#!/bin/bash
# Install dependencies
pip install -r requirements.txt
# Run collectstatic
python manage.py collectstatic --noinput