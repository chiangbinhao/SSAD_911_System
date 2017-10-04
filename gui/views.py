from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from django.contrib import messages
from django.contrib.auth import get_user_model
from .models import Report, Location
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic


def operator_view(request, username):
    username = get_object_or_404(get_user_model(), username=username)
    return render(request, 'gui/operatorGUI.html', {'name': username})


def create_report_view(request, username):
    if request.method == 'POST':
        name = request.POST['name']
        identity = request.POST['identity']
        date = request.POST['date']
        time = request.POST['time']
        category = request.POST['category']
        address = request.POST['address']
        title = request.POST['title']
        description = request.POST['description']
        priority = request.POST['priority']
        casualty = request.POST['casualty']
        lat = request.POST['lat']
        lng = request.POST['lng']

        global incidentid
        count = Report.objects.count()
        if count == 0:
            incidentid = "C1"
        else:
            lastreport = Report.objects.last()
            incidentid = lastreport.IncidentID
            incidentid = incidentid[1:]
            incidentid = "C" + str(int(incidentid) + 1)

        report = Report(
            OperatorID = request.user,
            IncidentID = incidentid,
            CallerName = name,
            CallerID = identity,
            Datetime = date + "T" + time + ":00+08:00",
            Category = category,
            Address = address,
            Title = title,
            Description = description,
            Priority = priority,
            Casualty = casualty
        )

        report.save()
        location = Location(
            Report=report,
            Lat=lat,
            Long=lng
        )
        location.save()
        messages.success(request, "You have successfully submitted the report [" + title + "]")
    return HttpResponse('')


class IndexView(LoginRequiredMixin, generic.ListView):
    template_name = 'gui/loGUI.html'

    def get_queryset(self):
        return Report.objects.order_by("-id")


def updateDetails(request, pk):
    report = Report.objects.get(pk=pk)
    return render(request, 'gui/detail.html', {'report': report, 'pk': pk})


def testLO(request):
    return render(request, 'gui/liaisonOfficerGUI.html')