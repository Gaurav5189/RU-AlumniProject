# Generated by Django 5.1.7 on 2025-04-02 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0003_alter_customuser_profile_img'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='profile_img',
            field=models.ImageField(default='default_pf.png', upload_to='profile_images/'),
        ),
    ]
