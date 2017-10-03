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
    form = UserLoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(username=username, password=password)
        login(request, user)
        messages.success(request, 'Welcome, Operator ' + username)
        request.session['username'] = username
        return redirect('/gui/operator/' + username)
    context = {
        'form': form,
        'title': title,
    }
    return render(request, 'accounts/loginForm.html', context)


def logout_view(request):
    logout(request)
    return redirect('/')