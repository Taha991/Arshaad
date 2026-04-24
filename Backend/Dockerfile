FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_ENVIRONMENT=prod
ENV DJANGO_SETTINGS_MODULE=arshaad.settings.prod

WORKDIR /app

# Install system deps needed by psycopg2-binary + Pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements/prod.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Collect static files (non-fatal — DB not needed here)
RUN python manage.py collectstatic --noinput || true

# Entrypoint: migrate then start gunicorn
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn arshaad.wsgi:application -c gunicorn.conf.py"]
