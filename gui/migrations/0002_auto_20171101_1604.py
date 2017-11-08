# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-01 08:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gui', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='report',
            old_name='OperatorID',
            new_name='Operator',
        ),
        migrations.AddField(
            model_name='report',
            name='Radius',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]