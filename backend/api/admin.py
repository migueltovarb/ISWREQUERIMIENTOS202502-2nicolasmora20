from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Activity, Inscription

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Activity)
admin.site.register(Inscription)
