# Generated by Django 5.1.7 on 2025-04-17 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0016_alter_customuser_phone_no'),
    ]

    operations = [
        migrations.CreateModel(
            name='TestImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to='test_images/')),
            ],
        ),
    ]
