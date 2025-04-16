# Generated by Django 5.1.7 on 2025-04-16 08:07

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0020_alter_customuser_profile_img'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_img',
            field=cloudinary.models.CloudinaryField(blank=True, default='default_pf.png', max_length=255, null=True, verbose_name='profile_image'),
        ),
    ]
