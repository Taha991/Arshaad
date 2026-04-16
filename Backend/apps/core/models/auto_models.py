# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Achievements(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    criteria = models.JSONField()
    points = models.IntegerField(blank=True, null=True)
    rarity = models.CharField(max_length=20, blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'achievements'


class AdminLogs(models.Model):
    admin = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=100, blank=True, null=True)
    resource_id = models.IntegerField(blank=True, null=True)
    old_values = models.JSONField(blank=True, null=True)
    new_values = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'admin_logs'


class Assessments(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    version = models.CharField(max_length=10, blank=True, null=True)
    answers_json = models.JSONField()
    score_vector = models.JSONField(blank=True, null=True)
    personality_traits = models.JSONField(blank=True, null=True)
    skill_levels = models.JSONField(blank=True, null=True)
    interests_vector = models.JSONField(blank=True, null=True)
    completion_time_seconds = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'assessments'


class AuthTokens(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    token = models.CharField(unique=True, max_length=255)
    token_type = models.CharField(max_length=50)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'auth_tokens'


class Discounts(models.Model):
    provider = models.CharField(max_length=100)
    course_title = models.CharField(max_length=255, blank=True, null=True)
    discount_code = models.CharField(max_length=100, blank=True, null=True)
    discount_url = models.TextField(blank=True, null=True)
    discount_percentage = models.IntegerField(blank=True, null=True)
    original_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    discounted_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    valid_from = models.DateTimeField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    max_uses = models.IntegerField(blank=True, null=True)
    current_uses = models.IntegerField(blank=True, null=True)
    target_tracks = models.TextField(blank=True, null=True)  # This field type is a guess.
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'discounts'


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class EventAttendees(models.Model):
    event = models.ForeignKey('Events', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    registered_at = models.DateTimeField(blank=True, null=True)
    attended_at = models.DateTimeField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'event_attendees'
        unique_together = (('event', 'user'),)


class Events(models.Model):
    external_id = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    tags = models.TextField(blank=True, null=True)  # This field type is a guess.
    organizer = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    venue = models.CharField(max_length=255, blank=True, null=True)
    is_online = models.BooleanField(blank=True, null=True)
    is_free = models.BooleanField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField(blank=True, null=True)
    registration_url = models.TextField(blank=True, null=True)
    event_url = models.TextField(blank=True, null=True)
    max_attendees = models.IntegerField(blank=True, null=True)
    current_attendees = models.IntegerField(blank=True, null=True)
    skills_focus = models.TextField(blank=True, null=True)  # This field type is a guess.
    target_audience = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'events'


class ExternalApiLogs(models.Model):
    provider = models.CharField(max_length=100)
    endpoint = models.CharField(max_length=255, blank=True, null=True)
    method = models.CharField(max_length=10, blank=True, null=True)
    status_code = models.IntegerField(blank=True, null=True)
    response_time_ms = models.IntegerField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    rate_limit_remaining = models.IntegerField(blank=True, null=True)
    cost = models.DecimalField(max_digits=8, decimal_places=4, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'external_api_logs'


class FeatureFlags(models.Model):
    name = models.CharField(unique=True, max_length=100)
    description = models.TextField(blank=True, null=True)
    is_enabled = models.BooleanField(blank=True, null=True)
    rollout_percentage = models.IntegerField(blank=True, null=True)
    target_users = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'feature_flags'


class JobApplications(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    job = models.ForeignKey('Jobs', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    applied_at = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'job_applications'
        unique_together = (('user', 'job'),)


class Jobs(models.Model):
    external_id = models.CharField(unique=True, max_length=255, blank=True, null=True)
    source = models.CharField(max_length=100)
    title = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    company_logo_url = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    salary_min = models.IntegerField(blank=True, null=True)
    salary_max = models.IntegerField(blank=True, null=True)
    salary_currency = models.CharField(max_length=3, blank=True, null=True)
    remote_ok = models.BooleanField(blank=True, null=True)
    hybrid_ok = models.BooleanField(blank=True, null=True)
    experience_level = models.CharField(max_length=50, blank=True, null=True)
    employment_type = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)  # This field type is a guess.
    preferred_qualifications = models.TextField(blank=True, null=True)  # This field type is a guess.
    benefits = models.TextField(blank=True, null=True)  # This field type is a guess.
    skills_required = models.TextField(blank=True, null=True)  # This field type is a guess.
    programming_languages = models.TextField(blank=True, null=True)  # This field type is a guess.
    tools_technologies = models.TextField(blank=True, null=True)  # This field type is a guess.
    application_url = models.TextField(blank=True, null=True)
    application_deadline = models.DateTimeField(blank=True, null=True)
    posted_at = models.DateTimeField(blank=True, null=True)
    scraped_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    view_count = models.IntegerField(blank=True, null=True)
    application_count = models.IntegerField(blank=True, null=True)
    match_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'jobs'


class LearningStreaks(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    current_streak = models.IntegerField(blank=True, null=True)
    longest_streak = models.IntegerField(blank=True, null=True)
    last_activity_date = models.DateField(blank=True, null=True)
    streak_start_date = models.DateField(blank=True, null=True)
    total_study_days = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'learning_streaks'


class MarketAnalytics(models.Model):
    country = models.CharField(max_length=100)
    track = models.CharField(max_length=100)
    skill = models.CharField(max_length=100, blank=True, null=True)
    demand_score = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    avg_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    salary_currency = models.CharField(max_length=3, blank=True, null=True)
    job_count = models.IntegerField(blank=True, null=True)
    growth_rate = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    data_date = models.DateField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'market_analytics'
        unique_together = (('country', 'track', 'skill', 'data_date'),)


class MentoringSessions(models.Model):
    mentor = models.ForeignKey('Mentors', models.DO_NOTHING, blank=True, null=True)
    mentee = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    scheduled_at = models.DateTimeField()
    duration_minutes = models.IntegerField(blank=True, null=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    session_type = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    feedback = models.TextField(blank=True, null=True)
    payment_amount = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mentoring_sessions'


class Mentors(models.Model):
    user = models.OneToOneField('Users', models.DO_NOTHING, primary_key=True)
    bio = models.TextField(blank=True, null=True)
    specializations = models.TextField(blank=True, null=True)  # This field type is a guess.
    experience_years = models.IntegerField(blank=True, null=True)
    company = models.CharField(max_length=255, blank=True, null=True)
    job_title = models.CharField(max_length=255, blank=True, null=True)
    skills = models.TextField(blank=True, null=True)  # This field type is a guess.
    availability = models.JSONField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    total_reviews = models.IntegerField(blank=True, null=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    timezone = models.CharField(max_length=50, blank=True, null=True)
    calendly_url = models.TextField(blank=True, null=True)
    zoom_link = models.TextField(blank=True, null=True)
    total_sessions = models.IntegerField(blank=True, null=True)
    total_mentees = models.IntegerField(blank=True, null=True)
    response_time_hours = models.IntegerField(blank=True, null=True)
    languages = models.TextField(blank=True, null=True)  # This field type is a guess.
    is_available = models.BooleanField(blank=True, null=True)
    is_verified = models.BooleanField(blank=True, null=True)
    mentor_since = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'mentors'


class MlTrainingLogs(models.Model):
    model_type = models.CharField(max_length=100)
    version = models.CharField(max_length=50)
    accuracy = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    precision_score = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    recall_score = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    f1_score = models.DecimalField(max_digits=5, decimal_places=4, blank=True, null=True)
    training_samples = models.IntegerField(blank=True, null=True)
    features_used = models.TextField(blank=True, null=True)  # This field type is a guess.
    hyperparameters = models.JSONField(blank=True, null=True)
    trained_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ml_training_logs'


class Notifications(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, null=True)
    action_url = models.TextField(blank=True, null=True)
    priority = models.CharField(max_length=20, blank=True, null=True)
    is_read = models.BooleanField(blank=True, null=True)
    read_at = models.DateTimeField(blank=True, null=True)
    sent_via = models.JSONField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'notifications'


class Progress(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    resource = models.ForeignKey('Resources', models.DO_NOTHING, blank=True, null=True)
    roadmap_stage = models.ForeignKey('RoadmapStages', models.DO_NOTHING, blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    progress_percentage = models.IntegerField(blank=True, null=True)
    time_spent_minutes = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    rating = models.IntegerField(blank=True, null=True)
    started_at = models.DateTimeField(blank=True, null=True)
    finished_at = models.DateTimeField(blank=True, null=True)
    last_activity = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'progress'


class PushTokens(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    token = models.CharField(max_length=500)
    platform = models.CharField(max_length=20)
    is_active = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    last_used = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'push_tokens'


class Recommendations(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    assessment = models.ForeignKey(Assessments, models.DO_NOTHING, blank=True, null=True)
    track = models.CharField(max_length=100)
    confidence = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    model_version = models.CharField(max_length=50, blank=True, null=True)
    explanation = models.TextField(blank=True, null=True)
    alternative_tracks = models.JSONField(blank=True, null=True)
    personalization_factors = models.JSONField(blank=True, null=True)
    feedback_score = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'recommendations'


class ResourceHealthChecks(models.Model):
    resource = models.ForeignKey('Resources', models.DO_NOTHING, blank=True, null=True)
    status_code = models.IntegerField(blank=True, null=True)
    response_time_ms = models.IntegerField(blank=True, null=True)
    is_accessible = models.BooleanField(blank=True, null=True)
    error_details = models.TextField(blank=True, null=True)
    checked_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resource_health_checks'


class Resources(models.Model):
    uuid = models.UUIDField(unique=True)
    type = models.CharField(max_length=50)
    title = models.CharField(max_length=255)
    provider = models.CharField(max_length=100, blank=True, null=True)
    url = models.TextField()
    thumbnail_url = models.TextField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    review_count = models.IntegerField(blank=True, null=True)
    difficulty_level = models.CharField(max_length=20, blank=True, null=True)
    is_free = models.BooleanField(blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2, blank=True, null=True)
    currency = models.CharField(max_length=3, blank=True, null=True)
    estimated_duration_hours = models.IntegerField(blank=True, null=True)
    language = models.CharField(max_length=10, blank=True, null=True)
    subtitles_available = models.TextField(blank=True, null=True)  # This field type is a guess.
    prerequisites = models.TextField(blank=True, null=True)  # This field type is a guess.
    skills_covered = models.TextField(blank=True, null=True)  # This field type is a guess.
    last_checked = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'resources'


class RoadmapResources(models.Model):
    roadmap_stage = models.ForeignKey('RoadmapStages', models.DO_NOTHING, blank=True, null=True)
    resource = models.ForeignKey(Resources, models.DO_NOTHING, blank=True, null=True)
    is_required = models.BooleanField(blank=True, null=True)
    order_in_stage = models.IntegerField(blank=True, null=True)
    estimated_completion_days = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roadmap_resources'


class RoadmapStages(models.Model):
    roadmap = models.ForeignKey('Roadmaps', models.DO_NOTHING, blank=True, null=True)
    stage_order = models.IntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    goals = models.TextField(blank=True, null=True)
    estimated_hours = models.IntegerField(blank=True, null=True)
    skills_gained = models.TextField(blank=True, null=True)  # This field type is a guess.
    completion_criteria = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roadmap_stages'


class Roadmaps(models.Model):
    uuid = models.UUIDField(unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)  # This field type is a guess.
    difficulty = models.CharField(max_length=20, blank=True, null=True)
    estimated_weeks = models.IntegerField(blank=True, null=True)
    prerequisites = models.TextField(blank=True, null=True)  # This field type is a guess.
    learning_objectives = models.TextField(blank=True, null=True)  # This field type is a guess.
    career_tracks = models.TextField(blank=True, null=True)  # This field type is a guess.
    popularity_score = models.IntegerField(blank=True, null=True)
    success_rate = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    created_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='created_by', blank=True, null=True)
    is_public = models.BooleanField(blank=True, null=True)
    is_featured = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'roadmaps'


class StudyGroupMembers(models.Model):
    study_group = models.ForeignKey('StudyGroups', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    role = models.CharField(max_length=50, blank=True, null=True)
    joined_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    contribution_score = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'study_group_members'
        unique_together = (('study_group', 'user'),)


class StudyGroups(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    roadmap = models.ForeignKey(Roadmaps, models.DO_NOTHING, blank=True, null=True)
    mentor = models.ForeignKey(Mentors, models.DO_NOTHING, blank=True, null=True)
    max_members = models.IntegerField(blank=True, null=True)
    current_members = models.IntegerField(blank=True, null=True)
    meeting_schedule = models.JSONField(blank=True, null=True)
    discord_url = models.TextField(blank=True, null=True)
    telegram_url = models.TextField(blank=True, null=True)
    whatsapp_url = models.TextField(blank=True, null=True)
    meeting_link = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    is_public = models.BooleanField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)  # This field type is a guess.
    language = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'study_groups'


class StudySessions(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    resource = models.ForeignKey(Resources, models.DO_NOTHING, blank=True, null=True)
    duration_minutes = models.IntegerField()
    quality_rating = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)  # This field type is a guess.
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'study_sessions'


class SystemSettings(models.Model):
    key = models.CharField(primary_key=True, max_length=100)
    value = models.JSONField()
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    is_public = models.BooleanField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    updated_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='updated_by', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'system_settings'


class UserAchievements(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    achievement = models.ForeignKey(Achievements, models.DO_NOTHING, blank=True, null=True)
    earned_at = models.DateTimeField(blank=True, null=True)
    progress_data = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_achievements'
        unique_together = (('user', 'achievement'),)


class UserActivityLogs(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    session_id = models.CharField(max_length=255, blank=True, null=True)
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=100, blank=True, null=True)
    resource_id = models.IntegerField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    duration_seconds = models.IntegerField(blank=True, null=True)
    device_info = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_activity_logs'


class UserDiscountUsage(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    discount = models.ForeignKey(Discounts, models.DO_NOTHING, blank=True, null=True)
    used_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_discount_usage'
        unique_together = (('user', 'discount'),)


class UserPreferences(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    learning_style = models.CharField(max_length=50, blank=True, null=True)
    preferred_language = models.CharField(max_length=10, blank=True, null=True)
    weekly_study_hours = models.IntegerField(blank=True, null=True)
    target_countries = models.TextField(blank=True, null=True)  # This field type is a guess.
    preferred_salary_range = models.JSONField(blank=True, null=True)
    remote_work_preference = models.BooleanField(blank=True, null=True)
    notification_settings = models.JSONField(blank=True, null=True)
    ai_personalization_enabled = models.BooleanField(blank=True, null=True)
    data_sharing_consent = models.BooleanField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_preferences'


class UserSessions(models.Model):
    user = models.ForeignKey('Users', models.DO_NOTHING, blank=True, null=True)
    refresh_token = models.CharField(unique=True, max_length=512)
    access_token_jti = models.CharField(max_length=255, blank=True, null=True)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(blank=True, null=True)
    last_used = models.DateTimeField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    device_info = models.JSONField(blank=True, null=True)
    is_mobile = models.BooleanField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user_sessions'


class Users(models.Model):
    uuid = models.UUIDField(unique=True)
    email = models.CharField(unique=True, max_length=255)
    password_hash = models.CharField(max_length=255, blank=True, null=True)
    role = models.CharField(max_length=50)
    uni_id = models.CharField(max_length=100, blank=True, null=True)
    name = models.CharField(max_length=150, blank=True, null=True)
    avatar = models.TextField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    university = models.CharField(max_length=255, blank=True, null=True)
    study_year = models.IntegerField(blank=True, null=True)
    major = models.CharField(max_length=100, blank=True, null=True)
    linkedin_url = models.CharField(max_length=255, blank=True, null=True)
    github_username = models.CharField(max_length=100, blank=True, null=True)
    last_login = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(blank=True, null=True)
    is_verified = models.BooleanField(blank=True, null=True)
    onboarding_completed = models.BooleanField(blank=True, null=True)
    is_staff = models.BooleanField(blank=True, null=True)
    is_superuser = models.BooleanField(blank=True, null=True)
    date_joined = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
