# Generated by Django 5.1.7 on 2025-04-11 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0013_delete_jobapplication'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='customuser',
            name='social_links',
            field=models.JSONField(blank=True, default=dict),
        ),
    ]
