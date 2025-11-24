from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('coordinator', 'Coordinador'),
        ('volunteer', 'Voluntario'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='volunteer')
    phone = models.CharField(max_length=20, blank=True, null=True)
    skills = models.TextField(blank=True, null=True, help_text="Habilidades separadas por comas")
    interests = models.TextField(blank=True, null=True, help_text="Intereses separados por comas")

class Activity(models.Model):
    CATEGORY_CHOICES = (
        ('environmental', 'Ambiental'),
        ('social', 'Social'),
        ('education', 'Educación'),
        ('health', 'Salud'),
        ('other', 'Otro'),
    )
    STATUS_CHOICES = (
        ('draft', 'Borrador'),
        ('published', 'Publicada'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
    )
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    date = models.DateField()
    start_time = models.TimeField(default='09:00')
    end_time = models.TimeField(default='17:00')
    location = models.CharField(max_length=200)
    spots = models.PositiveIntegerField()
    hours = models.DecimalField(max_digits=4, decimal_places=1, default=4.0, help_text="Horas de duración")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    coordinator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-date']

class Inscription(models.Model):
    STATUS_CHOICES = (
        ('registered', 'Inscrito'),
        ('attended', 'Asistió'),
        ('cancelled', 'Cancelado'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inscriptions')
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name='inscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    attended = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True, help_text="Notas del coordinador")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'activity')
        ordering = ['-created_at']
