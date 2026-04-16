from dj_rest_auth.registration.serializers import RegisterSerializer


class CustomRegisterSerializer(RegisterSerializer):
    username = None  # disable username field
    
    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.pop('username', None)  # remove username if exists
        return data