from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from .forms import UserLoginForm
from django.contrib import messages


def login_view(request):
    title = "Login"
    if request.POST:
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            login(request, user)
            if request.user.is_authenticated():
                if request.user.username.startswith('OP'):
                    messages.success(request, 'Welcome, Operator ' + request.user.username)
                    return redirect('/op/' + str(request.user.pk) + '/' + request.user.username)
                elif request.user.username.startswith('LO'):
                    messages.success(request, 'Welcome, Liaison Officer ' + request.user.username)
                    return redirect('/lo/' + str(request.user.pk) + '/' + request.user.username)
    elif request.user.is_authenticated():
        if request.user.username.startswith('OP'):
            messages.success(request, 'Welcome, Operator ' + request.user.username)
            return redirect('/op/' + str(request.user.pk) + '/' + request.user.username)
        elif request.user.username.startswith('LO'):
            messages.success(request, 'Welcome, Liaison Officer ' + request.user.username)
            return redirect('/lo/' + str(request.user.pk) + '/' + request.user.username)
    form = UserLoginForm(request.POST)
    context = {
        'form': form,
        'title': title,
    }
    return render(request, 'accounts/loginForm.html', context)


def logout_view(request):
    logout(request)
    return redirect('/')