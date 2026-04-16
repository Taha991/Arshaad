"""
Roadmap Service
Handles creation and management of learning roadmaps
"""
from typing import List, Optional
from ..models import Roadmap, RoadmapStage, Resource, RoadmapResource
from apps.users.models import User
from .roadmap_fetcher import RoadmapFetcher


class RoadmapService:
    """
    Service for managing user roadmaps
    """
    
    # Track-specific roadmap templates
    TRACK_ROADMAPS = {
        'AI/ML': {
            'title': 'مسار الذكاء الاصطناعي وتعلم الآلة',
            'description': 'مسار شامل لتعلم الذكاء الاصطناعي وتعلم الآلة من الأساسيات إلى المستوى المتقدم',
            'stages': [
                {
                    'title': 'الأساسيات',
                    'description': 'تعلم أساسيات البرمجة والرياضيات',
                    'order': 1,
                    'resources': [
                        {'title': 'Python Basics', 'type': 'course', 'url': 'https://www.python.org/about/gettingstarted/'},
                        {'title': 'Linear Algebra', 'type': 'course', 'url': 'https://www.khanacademy.org/math/linear-algebra'},
                    ]
                },
                {
                    'title': 'تعلم الآلة',
                    'description': 'مقدمة في تعلم الآلة والخوارزميات',
                    'order': 2,
                    'resources': [
                        {'title': 'Machine Learning Course', 'type': 'course', 'url': 'https://www.coursera.org/learn/machine-learning'},
                        {'title': 'Hands-On ML Book', 'type': 'book', 'url': 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/'},
                    ]
                },
                {
                    'title': 'التعلم العميق',
                    'description': 'الشبكات العصبية والتعلم العميق',
                    'order': 3,
                    'resources': [
                        {'title': 'Deep Learning Specialization', 'type': 'course', 'url': 'https://www.coursera.org/specializations/deep-learning'},
                    ]
                },
                {
                    'title': 'مشاريع عملية',
                    'description': 'بناء مشاريع حقيقية',
                    'order': 4,
                    'resources': []
                }
            ]
        },
        'Web Development': {
            'title': 'مسار تطوير الويب',
            'description': 'مسار شامل لتطوير الويب من Frontend إلى Backend',
            'stages': [
                {
                    'title': 'HTML & CSS',
                    'description': 'أساسيات تطوير الويب',
                    'order': 1,
                    'resources': [
                        {'title': 'Frontend Roadmap', 'type': 'article', 'url': 'https://roadmap.sh/frontend'},
                    ]
                },
                {
                    'title': 'JavaScript',
                    'description': 'تعلم JavaScript',
                    'order': 2,
                    'resources': [
                        {'title': 'JavaScript Roadmap', 'type': 'article', 'url': 'https://roadmap.sh/javascript'},
                    ]
                },
                {
                    'title': 'Frontend Framework',
                    'description': 'React أو Vue',
                    'order': 3,
                    'resources': [
                        {'title': 'React Roadmap', 'type': 'article', 'url': 'https://roadmap.sh/react'},
                    ]
                },
                {
                    'title': 'Backend Development',
                    'description': 'Node.js أو Python/Django',
                    'order': 4,
                    'resources': [
                        {'title': 'Backend Roadmap', 'type': 'article', 'url': 'https://roadmap.sh/backend'},
                    ]
                }
            ]
        },
        'Game Development': {
            'title': 'مسار تطوير الألعاب',
            'description': 'مسار شامل لتطوير الألعاب من الأساسيات إلى الإطلاق',
            'stages': [
                {
                    'title': 'أساسيات تطوير الألعاب',
                    'description': 'Game Design, Programming Basics, Game Development Fundamentals',
                    'order': 1,
                    'resources': [
                        {'title': 'Game Developer Roadmap', 'type': 'article', 'url': 'https://roadmap.sh/game-developer'},
                        {'title': 'Unity Learn - Free Courses', 'type': 'course', 'url': 'https://learn.unity.com/'},
                        {'title': 'Game Design Basics', 'type': 'course', 'url': 'https://www.coursera.org/learn/game-design'},
                    ]
                },
                {
                    'title': 'محركات الألعاب',
                    'description': 'Unity, Unreal Engine, Godot - اختر محركك',
                    'order': 2,
                    'resources': [
                        {'title': 'Unity Documentation', 'type': 'article', 'url': 'https://docs.unity3d.com/'},
                        {'title': 'Unreal Engine Tutorials', 'type': 'course', 'url': 'https://www.unrealengine.com/en-US/onlinelearning-courses'},
                        {'title': 'Godot Documentation', 'type': 'article', 'url': 'https://docs.godotengine.org/'},
                    ]
                },
                {
                    'title': 'البرمجة للألعاب',
                    'description': 'C#, C++, Game Programming Patterns',
                    'order': 3,
                    'resources': [
                        {'title': 'C# for Unity', 'type': 'course', 'url': 'https://learn.unity.com/course/scripting'},
                        {'title': 'Game Programming Patterns', 'type': 'book', 'url': 'https://gameprogrammingpatterns.com/'},
                    ]
                },
                {
                    'title': 'بناء مشاريع',
                    'description': 'بناء ألعاب كاملة وإطلاقها',
                    'order': 4,
                    'resources': [
                        {'title': 'Game Jams', 'type': 'article', 'url': 'https://itch.io/jams'},
                        {'title': 'Publishing Guide', 'type': 'article', 'url': 'https://roadmap.sh/game-developer'},
                    ]
                },
            ]
        },
        # Add more tracks as needed
    }
    
    def create_user_roadmap(self, user: User, track: str) -> Optional[Roadmap]:
        """
        Create a personalized roadmap for a user based on their selected track
        Fetches content from roadmap.sh or uses templates
        
        Args:
            user: The user to create roadmap for
            track: The selected career track
            
        Returns:
            Created Roadmap instance
        """
        # Check if user already has a roadmap for this track
        existing_roadmap = Roadmap.objects.filter(
            user=user,
            track=track
        ).first()
        
        if existing_roadmap:
            return existing_roadmap
        
        # Try to fetch from roadmap.sh first
        fetcher = RoadmapFetcher()
        external_roadmap = fetcher.fetch_roadmap_content(track)
        
        # Use external roadmap if available, otherwise use template
        if external_roadmap:
            template = {
                'title': f'مسار {track}',
                'description': f'مسار تعليمي شامل لـ {track} - من roadmap.sh',
                'stages': external_roadmap.get('stages', [])
            }
        else:
            # Get roadmap template for track
            template = self.TRACK_ROADMAPS.get(track)
            if not template:
                # Create a generic roadmap if track not found
                template = {
                    'title': f'مسار {track}',
                    'description': f'مسار تعليمي مخصص لـ {track}',
                    'stages': [
                        {
                            'title': 'البداية',
                            'description': 'ابدأ رحلتك التعليمية',
                            'order': 1,
                            'resources': []
                        }
                    ]
                }
        
        # Create roadmap
        roadmap = Roadmap.objects.create(
            user=user,
            title=template['title'],
            description=template['description'],
            track=track,
            is_active=True,
            created_by=user,
            career_tracks=[track] if isinstance(track, str) else track
        )
        
        # Create stages and resources
        for stage_data in template['stages']:
            stage = RoadmapStage.objects.create(
                roadmap=roadmap,
                title=stage_data['title'],
                description=stage_data.get('description', ''),
                stage_order=stage_data['order']
            )
            
            # Create resources for this stage
            resource_order = 1
            for resource_data in stage_data.get('resources', []):
                resource, created = Resource.objects.get_or_create(
                    url=resource_data['url'],
                    defaults={
                        'title': resource_data['title'],
                        'type': resource_data['type'],
                    }
                )
                # Link resource to stage via RoadmapResource
                RoadmapResource.objects.get_or_create(
                    roadmap_stage=stage,
                    resource=resource,
                    defaults={
                        'order_in_stage': resource_order,
                        'is_required': True
                    }
                )
                resource_order += 1
        
        return roadmap
    
    def get_user_roadmap(self, user: User, track: str = None) -> Optional[Roadmap]:
        """
        Get user's active roadmap
        
        Args:
            user: The user
            track: Optional track filter
            
        Returns:
            Roadmap instance or None
        """
        queryset = Roadmap.objects.filter(user=user, is_active=True)
        if track:
            queryset = queryset.filter(track=track)
        return queryset.order_by('-created_at').first()
    
    def add_resource_to_stage(
        self,
        stage: RoadmapStage,
        title: str,
        type: str,
        url: str
    ) -> Resource:
        """
        Add a resource to a roadmap stage
        
        Args:
            stage: The roadmap stage
            title: Resource title
            type: Resource type (course, book, video, etc.)
            url: Resource URL
            
        Returns:
            Created Resource instance
        """
        resource = Resource.objects.create(
            title=title,
            type=type,
            url=url
        )
        RoadmapResource.objects.create(
            roadmap_stage=stage,
            resource=resource,
            order_in_stage=1
        )
        return resource

