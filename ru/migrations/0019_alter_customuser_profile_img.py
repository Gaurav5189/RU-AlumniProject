# Generated by Django 5.1.7 on 2025-04-17 09:24

import cloudinary_storage.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0018_alter_testimage_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_img',
            field=models.ImageField(default='https://res.cloudinary.com/do7vm8vz3/image/upload/v1744881837/default_pf_faq5zi.png', storage=cloudinary_storage.storage.MediaCloudinaryStorage(), upload_to='profile_images/'),
        ),
    ]
