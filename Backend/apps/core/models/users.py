# This file now imports User models from the users app
# to maintain backward compatibility with existing imports

from apps.users.models import User, UserSession, AuthToken

# Re-export these models to maintain compatibility
__all__ = ['User', 'UserSession', 'AuthToken']