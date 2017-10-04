from django.conf.urls import url
from . import views

app_name = 'gui'

urlpatterns = [
    url(r'^operator/(?P<username>[0-9a-zA-Z_]+)/$', views.operator_view, name='operator'),
    url(r'^operator/(?P<username>[0-9a-zA-Z_]+)/create/report/$', views.create_report_view, name='opCreateReport'),
    url(r'^lo/$', views.IndexView.as_view(), name='index'),
    url(r'^lo/(?P<pk>[0-9]+?)/$', views.updateDetails, name='detail'),
    url(r'^test/$', views.testLO, name='testLO')
]