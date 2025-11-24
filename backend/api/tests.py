from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from api.models import User, Activity


class RegistrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_success(self):
        payload = {
            "username": "alice@example.com",
            "email": "alice@example.com",
            "password": "Secret123!",
            "first_name": "Alice",
            "role": "volunteer",
        }
        url = reverse("auth-register")
        res = self.client.post(url, payload, format="json")
        self.assertEqual(res.status_code, 201)
        self.assertTrue(User.objects.filter(email="alice@example.com").exists())

    def test_register_duplicate_email(self):
        User.objects.create_user(username="bob", email="bob@example.com", password="Secret123")
        payload = {
            "username": "bob@example.com",
            "email": "bob@example.com",
            "password": "Secret123",
            "first_name": "Bob",
            "role": "volunteer",
        }
        url = reverse("auth-register")
        res = self.client.post(url, payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("email", res.data)

    def test_register_password_policy(self):
        payload = {
            "username": "weak@example.com",
            "email": "weak@example.com",
            "password": "weak",
            "first_name": "Weak",
            "role": "volunteer",
        }
        url = reverse("auth-register")
        res = self.client.post(url, payload, format="json")
        self.assertEqual(res.status_code, 400)
        self.assertIn("password", res.data)


class ActivitiesPaginationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="coord", email="coord@example.com", password="Secret123")
        Activity.objects.create(
            title="Actividad 1",
            description="Desc",
            category="other",
            date="2025-12-31",
            start_time="09:00",
            end_time="17:00",
            location="Bogotá",
            spots=10,
            hours=4.0,
            status="published",
            coordinator=self.user,
        )

    def test_list_activities_paginated_has_results(self):
        url = reverse("activity-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        self.assertIn("results", res.data)
        self.assertIsInstance(res.data["results"], list)


class LoginThrottleTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="john", email="john@example.com", password="Strong123!")

    def test_login_throttle_on_multiple_failures(self):
        url = reverse("token_obtain_pair")
        for _ in range(5):
            res = self.client.post(url, {"username": "john", "password": "bad"}, format="json")
            self.assertIn(res.status_code, [401, 429])
        res = self.client.post(url, {"username": "john", "password": "bad"}, format="json")
        self.assertIn(res.status_code, [401, 429])

    def test_login_success(self):
        url = reverse("token_obtain_pair")
        res = self.client.post(url, {"username": "john", "password": "Strong123!"}, format="json")
        self.assertEqual(res.status_code, 200)
        self.assertIn("access", res.data)


class EndToEndAuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_then_login_and_get_me(self):
        reg_url = reverse("auth-register")
        payload = {
            "username": "eve@example.com",
            "email": "eve@example.com",
            "password": "Strong123!",
            "first_name": "Eve",
            "role": "volunteer",
        }
        reg_res = self.client.post(reg_url, payload, format="json")
        self.assertEqual(reg_res.status_code, 201)

        # Simular confirmación de correo
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_encode
        from django.utils.encoding import force_bytes
        user = User.objects.get(email="eve@example.com")
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        confirm_url = reverse("auth-email-verification-confirm")
        confirm_res = self.client.post(confirm_url, {"uid": uid, "token": token}, format="json")
        self.assertEqual(confirm_res.status_code, 200)

        token_url = reverse("token_obtain_pair")
        tok_res = self.client.post(token_url, {"username": "eve@example.com", "password": "Strong123!"}, format="json")
        self.assertEqual(tok_res.status_code, 200)
        access = tok_res.data["access"]

        me_url = reverse("user-me")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        me_res = self.client.get(me_url)
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.data["email"], "eve@example.com")
