from rest_framework import viewsets, permissions, status, serializers
from rest_framework.response import Response
from django.conf import settings
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Activity, Inscription
from .serializers import UserSerializer, RegisterSerializer, ActivitySerializer, InscriptionSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'])
    def update_me(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            # Solo permitir actualizar ciertos campos
            allowed_fields = ['first_name', 'last_name', 'phone', 'skills', 'interests']
            for field in request.data:
                if field not in allowed_fields:
                    return Response(
                        {'error': f'No se permite modificar el campo: {field}'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Desactivar hasta confirmar email
            user.is_active = False
            user.save()
            from django.core.mail import send_mail
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_encode
            from django.utils.encoding import force_bytes
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"{settings.FRONTEND_ORIGIN}/confirm-email/{uid}/{token}/"
            send_mail(
                'Confirma tu correo - Plataforma de Voluntariado',
                f'Hola {user.first_name},\n\nConfirma tu correo haciendo clic en:\n{confirm_link}\n\nGracias por registrarte.',
                'noreply@voluntariado.com',
                [user.email],
                fail_silently=False,
            )
            data = UserSerializer(user).data
            data.update({'message': 'Registro creado. Revisa tu correo para confirmar la cuenta.'})
            return Response(data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def password_reset_request(self, request):
        from django.core.mail import send_mail
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # En desarrollo, el token se imprime en consola
            reset_link = f"{settings.FRONTEND_ORIGIN}/reset-password/{uid}/{token}/"
            
            send_mail(
                'Recuperación de Contraseña - Plataforma de Voluntariado',
                f'Hola {user.first_name},\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n{reset_link}\n\nSi no solicitaste este cambio, ignora este correo.',
                'noreply@voluntariado.com',
                [email],
                fail_silently=False,
            )
            
            return Response({'message': 'Se ha enviado un correo con instrucciones para recuperar tu contraseña'})
        except User.DoesNotExist:
            # Por seguridad, no revelar si el email existe o no
            return Response({'message': 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña'})
    
    @action(detail=False, methods=['post'])
    def password_reset_confirm(self, request):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str
        
        uid = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')
        
        if not all([uid, token, new_password]):
            return Response({'error': 'Todos los campos son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Contraseña actualizada exitosamente'})
            else:
                return Response({'error': 'El enlace de recuperación es inválido o ha expirado'}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Enlace inválido'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def email_verification_confirm(self, request):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode
        from django.utils.encoding import force_str
        uid = request.data.get('uid')
        token = request.data.get('token')
        if not all([uid, token]):
            return Response({'error': 'Parametros incompletos'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({'message': 'Email confirmado. Ya puedes iniciar sesión.'})
            else:
                return Response({'error': 'Token inválido o expirado'}, status=status.HTTP_400_BAD_REQUEST)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Enlace inválido'}, status=status.HTTP_400_BAD_REQUEST)

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['date', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filtro por rango de fechas
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(coordinator=self.request.user)
    
    @action(detail=True, methods=['get', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def attendance(self, request, pk=None):
        activity = self.get_object()
        
        # Verificar que el usuario sea el coordinador
        if activity.coordinator != request.user and request.user.role != 'admin':
            return Response(
                {'error': 'Solo el coordinador puede gestionar la asistencia'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if request.method == 'GET':
            inscriptions = activity.inscriptions.all()
            serializer = InscriptionSerializer(inscriptions, many=True)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            # Actualizar asistencia
            attendance_data = request.data.get('attendance', [])
            for item in attendance_data:
                try:
                    inscription = Inscription.objects.get(
                        id=item['id'],
                        activity=activity
                    )
                    inscription.attended = item.get('attended', False)
                    inscription.notes = item.get('notes', '')
                    if inscription.attended:
                        inscription.status = 'attended'
                    inscription.save()
                except Inscription.DoesNotExist:
                    continue
            
            return Response({'message': 'Asistencia actualizada correctamente'})

class InscriptionViewSet(viewsets.ModelViewSet):
    queryset = Inscription.objects.all()
    serializer_class = InscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Los usuarios solo ven sus propias inscripciones
        if self.request.user.role == 'admin':
            return Inscription.objects.all()
        return Inscription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        activity = serializer.validated_data['activity']
        if activity.spots > 0:
            activity.spots -= 1
            activity.save()
            serializer.save(user=self.request.user)
        else:
            raise serializers.ValidationError("No hay cupos disponibles")
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def certificate(self, request, pk=None):
        from django.http import HttpResponse
        from reportlab.lib.pagesizes import letter, A4
        from reportlab.pdfgen import canvas
        from reportlab.lib.units import inch
        import uuid
        
        inscription = self.get_object()
        
        # Verificar que el usuario sea el dueño de la inscripción
        if inscription.user != request.user:
            return Response(
                {'error': 'No tienes permiso para descargar este certificado'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar que haya asistido
        if not inscription.attended:
            return Response(
                {'error': 'Solo puedes descargar certificados de actividades completadas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Crear PDF
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="certificado_{inscription.id}.pdf"'
        
        p = canvas.Canvas(response, pagesize=A4)
        width, height = A4
        
        # Código único de validación
        validation_code = str(uuid.uuid4())[:8].upper()
        
        # Título
        p.setFont("Helvetica-Bold", 24)
        p.drawCentredString(width/2, height - 2*inch, "CERTIFICADO DE VOLUNTARIADO")
        
        # Contenido
        p.setFont("Helvetica", 14)
        p.drawCentredString(width/2, height - 3*inch, "Se certifica que")
        
        p.setFont("Helvetica-Bold", 18)
        p.drawCentredString(width/2, height - 3.5*inch, inscription.user.get_full_name() or inscription.user.username)
        
        p.setFont("Helvetica", 14)
        p.drawCentredString(width/2, height - 4.2*inch, "participó exitosamente en la actividad")
        
        p.setFont("Helvetica-Bold", 16)
        p.drawCentredString(width/2, height - 4.8*inch, inscription.activity.title)
        
        p.setFont("Helvetica", 12)
        p.drawCentredString(width/2, height - 5.5*inch, f"Realizada el {inscription.activity.date}")
        p.drawCentredString(width/2, height - 6*inch, f"Duración: {inscription.activity.hours} horas")
        
        # Código de validación
        p.setFont("Helvetica", 10)
        p.drawCentredString(width/2, height - 7*inch, f"Código de validación: {validation_code}")
        
        # Firma
        p.setFont("Helvetica-Oblique", 10)
        p.drawCentredString(width/2, 2*inch, "Plataforma de Gestión de Voluntariado")
        p.drawCentredString(width/2, 1.5*inch, f"Coordinador: {inscription.activity.coordinator.get_full_name()}")
        
        p.showPage()
        p.save()
        
        return response


class ThrottledTokenObtainPairView(TokenObtainPairView):
    throttle_scope = 'auth'


@ensure_csrf_cookie
@api_view(['GET'])
def csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token})
