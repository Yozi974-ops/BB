npm install expo react react-native react-dom expo-router expo-status-bar expo-splash-screen expo-system-ui expo-linking expo-constants expo-font expo-haptics expo-image expo-web-browser expo-document-picker expo-blur expo-symbols @react-navigation/native @react-navigation/bottom-tabs @react-navigation/elements react-native-safe-area-context react-native-screens react-native-gesture-handler react-native-reanimated @expo/vector-icons react-hook-form @hookform/resolvers zustand axios react-native-web react-native-webview @react-native-async-storage/async-storage
from django.urls import path
from .views import RegisterView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
]
