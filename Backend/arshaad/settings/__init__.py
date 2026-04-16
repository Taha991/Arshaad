from .base import *

import os

# Default to development settings
ENVIRONMENT = os.environ.get('DJANGO_ENVIRONMENT', 'dev')

if ENVIRONMENT == 'prod':
    from .prod import *
else:
    from .dev import *