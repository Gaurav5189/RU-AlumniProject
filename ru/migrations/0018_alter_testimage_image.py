# Generated by Django 5.1.7 on 2025-04-17 08:32

import cloudinary_storage.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0017_testimage'),
    ]

    operations = [
        migrations.AlterField(
            model_name='testimage',
            name='image',
            field=models.ImageField(storage=cloudinary_storage.storage.MediaCloudinaryStorage(), upload_to='test_images/'),
        ),
    ]
