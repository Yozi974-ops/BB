from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password", "display_name")

    def create(self, validated_data):
        pwd = validated_data.pop("password")
        user = User(**validated_data)
        validate_password(pwd, user)
        user.set_password(pwd)
        user.save()
        return user
