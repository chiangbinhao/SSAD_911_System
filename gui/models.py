from django.db import models
from django.conf import settings
from channels.binding.websockets import WebsocketBinding


class Report(models.Model):
    Operator = models.ForeignKey(settings.AUTH_USER_MODEL, blank=False)
    IncidentID = models.CharField(max_length=100, blank=False)
    CallerName = models.CharField(max_length=250, blank=True)
    CallerID = models.CharField(max_length=9, blank=True)
    Datetime = models.CharField(max_length=50, blank=False)
    Category = models.CharField(max_length=100, blank=False)
    Address = models.CharField(max_length=250, blank=False)
    Title = models.CharField(max_length=500, blank=False)
    Description = models.CharField(max_length=1000, blank=False)
    Priority = models.CharField(max_length=6, blank=False)
    Casualty = models.IntegerField(blank=False)
    Vetted = models.BooleanField(default=False)
    Radius = models.IntegerField(blank=False)

    def __str__(self):
        return self.IncidentID + ': ' + self.Title


class Location(models.Model):
    Report = models.OneToOneField(Report, blank=False)
    Lat = models.CharField(max_length=20, blank=False)
    Long = models.CharField(max_length=20, blank=False)

    def __str__(self):
        return self.Report.IncidentID


class ReportBinding(WebsocketBinding):
    model = Report
    stream = "report"
    fields = ["Operator", "IncidentID", "Datetime", "Title", "Description", "Priority", "Casualty", "Radius"]

    @classmethod
    def group_names(cls, *args, **kwargs):
        return ["binding.gui"]

    def has_permission(self, user, action, pk):
        return True