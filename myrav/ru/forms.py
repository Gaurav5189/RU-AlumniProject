# accounts/forms.py
from django import forms # type: ignore

class EmailForm(forms.Form):
    email = forms.EmailField(label="Email Address", widget=forms.EmailInput(attrs={'class': 'form-control'}))

class OTPForm(forms.Form):
    otp_code = forms.CharField(label="Enter OTP", max_length=6, widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': '6-digit code'}))
