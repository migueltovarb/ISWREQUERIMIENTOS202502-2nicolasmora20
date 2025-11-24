from rest_framework import serializers
from .models import User, Activity, Inscription
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'skills', 'interests')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        email = validated_data['email']
        username_input = validated_data.get('username') or email
        base = username_input.split('@')[0] if '@' in username_input else username_input
        candidate = username_input
        i = 1
        while User.objects.filter(username=candidate).exists():
            candidate = f"{base}{i}"
            i += 1
        user = User.objects.create_user(
            username=candidate,
            email=email,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'volunteer')
        )
        return user

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email es requerido")
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Formato de email inválido")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este email")
        return value

    def validate(self, attrs):
        password = attrs.get('password')
        if not password:
            raise serializers.ValidationError({"password": "La contraseña es requerida"})
        if len(password) < 8:
            raise serializers.ValidationError({"password": "La contraseña debe tener al menos 8 caracteres"})
        if not any(c.isupper() for c in password):
            raise serializers.ValidationError({"password": "Debe incluir al menos una mayúscula"})
        if not any(c.isdigit() for c in password):
            raise serializers.ValidationError({"password": "Debe incluir al menos un número"})
        specials = set('!@#$%^&*()-_=+[]{};:,./<>?\\|`~')
        if not any(c in specials for c in password):
            raise serializers.ValidationError({"password": "Debe incluir al menos un carácter especial"})
        required = ['email', 'first_name']
        missing = [f for f in required if not attrs.get(f)]
        if missing:
            raise serializers.ValidationError({k: "Campo obligatorio" for k in missing})
        return attrs

class ActivitySerializer(serializers.ModelSerializer):
    coordinator_name = serializers.ReadOnlyField(source='coordinator.get_full_name')
    inscriptions_count = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = '__all__'
        read_only_fields = ('coordinator', 'created_at')
    
    def get_inscriptions_count(self, obj):
        return obj.inscriptions.filter(status='registered').count()

class InscriptionSerializer(serializers.ModelSerializer):
    activity_title = serializers.ReadOnlyField(source='activity.title')
    user_name = serializers.ReadOnlyField(source='user.get_full_name')
    activity_date = serializers.ReadOnlyField(source='activity.date')
    activity_hours = serializers.ReadOnlyField(source='activity.hours')

    class Meta:
        model = Inscription
        fields = '__all__'
        read_only_fields = ('user', 'created_at')
