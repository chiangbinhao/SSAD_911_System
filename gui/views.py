from django.contrib.auth.models import User
from django.http import HttpResponse, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth import get_user_model
from .models import Report, Location
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views import generic


def operator_view(request, pk, username):
    if request.user.is_authenticated():
        username = get_object_or_404(get_user_model(), pk=pk, username=username)
        return render(request, 'gui/operatorGUI.html', {'name': 'Operator ' + request.user.username})
    else:
        raise Http404("You are not logged in")


def create_report_view(request, pk, username):
    if request.method == 'POST':
        if request.user.is_authenticated():
            try:
                queryset = User.objects.filter()
                get_object_or_404(queryset, pk=pk)
                user = User.objects.get(pk=pk, username=username)
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
                radius = request.POST['radius']

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
                    Operator=request.user,
                    IncidentID=incidentid,
                    CallerName=name,
                    CallerID=identity,
                    Datetime=date + "T" + time + ":00+08:00",
                    Category=category,
                    Address=address,
                    Title=title,
                    Description=description,
                    Priority=priority,
                    Casualty=casualty,
                    Radius=radius
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
            except User.DoesNotExist:
                raise Http404("User does not exist")
        else:
            return redirect('/')
    else:
        return HttpResponse('')


def lo_view(request, pk, username):
    if request.user.is_authenticated():
        get_object_or_404(get_user_model(), pk=pk, username=username)
        report_list = Report.objects.filter(Vetted=False)
        red_report_list = report_list.filter(Priority='red')
        yellow_report_list = report_list.filter(Priority='yellow')
        green_report_list = report_list.filter(Priority='green')
		
        context = {
            'name': 'Liaison Officer ' + request.user.username,
            'red_report_list': red_report_list,
            'yellow_report_list': yellow_report_list,
            'green_report_list': green_report_list,
        }
        return render(request, 'gui/liaisonOfficerGUI.html', context)
    else:
        raise Http404("You are not logged in")


def retrieve_details(request, pk, username, reportPK):
    report = Report.objects.get(pk=reportPK)
    location = Location.objects.get(Report=report)
    return render(request, 'gui/detail.html', {'report': report, 'location': location,})


def update_details(request, pk, username, reportPK):
	if request.method == 'POST':
		crisis = request.POST['crisis']
		report = Report.objects.get(pk=reportPK)
		incidentID = report.IncidentID
		title = report.Title
		report.Vetted = True
		report.save()
		if crisis == "n":
			messages.success(request, "Successfully authenticated Non-Crisis Report [" + incidentID + "] " + title)
		else:
			messages.success(request, "Successfully authenticated Crisis Report [" + incidentID + "] " + title)
		return HttpResponse(report.Vetted)

	return HttpResponse('false')