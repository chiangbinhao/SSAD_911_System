from django.conf.urls import url
from . import views

app_name = 'gui'

urlpatterns = [
    url(r'^op/(?P<pk>[0-9]+)/(?P<username>[0-9a-zA-Z_]+)/$', views.operator_view, name='operator'),
    url(r'^op/(?P<pk>[0-9]+)/(?P<username>[0-9a-zA-Z_]+)/create/report/$', views.create_report_view, name='opCreateReport'),
    url(r'^lo/(?P<pk>[0-9]+)/(?P<username>[0-9a-zA-Z_]+)/$', views.lo_view, name='lo'),
    url(r'^lo/(?P<pk>[0-9]+)/(?P<username>[0-9a-zA-Z_]+)/retrieve/report/(?P<reportPK>[0-9a-zA-Z_]+)/$', views.retrieve_details, name='detail'),
    url(r'^lo/(?P<pk>[0-9]+)/(?P<username>[0-9a-zA-Z_]+)/update/report/(?P<reportPK>[0-9a-zA-Z_]+)/$', views.update_details, name='update'),
]