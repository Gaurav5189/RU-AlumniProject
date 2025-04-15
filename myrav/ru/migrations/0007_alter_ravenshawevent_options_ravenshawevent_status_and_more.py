# Generated by Django 5.1.7 on 2025-04-05 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ru', '0006_ravenshawevent'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='ravenshawevent',
            options={'ordering': ['-event_date'], 'verbose_name': 'Ravenshaw Event', 'verbose_name_plural': 'Ravenshaw Events'},
        ),
        migrations.AddField(
            model_name='ravenshawevent',
            name='status',
            field=models.CharField(choices=[('upcoming', 'Upcoming'), ('ongoing', 'Ongoing'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='upcoming', max_length=20),
        ),
        migrations.AddField(
            model_name='ravenshawevent',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
