# Generated by Django 5.1.7 on 2025-04-10 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0009_delete_alumniconnection'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='subject',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
    ]
