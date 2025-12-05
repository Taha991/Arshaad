"""
Roadmap Service
Handles creation and management of learning roadmaps
"""
from typing import List, Optional
from .models import Roadmap, RoadmapStage, Resource
from apps.users.models import User


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
                        {'title': 'Python Basics', 'type': 'course', 'url': 'https://example.com/python'},
                        {'title': 'Linear Algebra', 'type': 'book', 'url': 'https://example.com/linear-algebra'},
                    ]
                },
                {
                    'title': 'تعلم الآلة',
                    'description': 'مقدمة في تعلم الآلة والخوارزميات',
                    'order': 2,
                    'resources': [
                        {'title': 'Machine Learning Course', 'type': 'course', 'url': 'https://example.com/ml'},
                        {'title': 'Hands-On ML Book', 'type': 'book', 'url': 'https://example.com/hands-on-ml'},
                    ]
                },
                {
                    'title': 'التعلم العميق',
                    'description': 'الشبكات العصبية والتعلم العميق',
                    'order': 3,
                    'resources': [
                        {'title': 'Deep Learning Specialization', 'type': 'course', 'url': 'https://example.com/dl'},
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
                    'resources': []
                },
                {
                    'title': 'JavaScript',
                    'description': 'تعلم JavaScript',
                    'order': 2,
                    'resources': []
                },
                {
                    'title': 'Frontend Framework',
                    'description': 'React أو Vue',
                    'order': 3,
                    'resources': []
                },
                {
                    'title': 'Backend Development',
                    'description': 'Node.js أو Python/Django',
                    'order': 4,
                    'resources': []
                }
            ]
        },
        # Add more tracks as needed
    }
    
    def create_user_roadmap(self, user: User, track: str) -> Optional[Roadmap]:
        """
        Create a personalized roadmap for a user based on their selected track
        
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
            is_active=True
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
            for resource_data in stage_data.get('resources', []):
                resource = Resource.objects.create(
                    title=resource_data['title'],
                    type=resource_data['type'],
                    url=resource_data['url']
                )
                # Link resource to stage via RoadmapResource
                from .models import RoadmapResource
                RoadmapResource.objects.create(
                    roadmap_stage=stage,
                    resource=resource,
                    order_in_stage=len(stage_data.get('resources', []))
                )
        
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
        return Resource.objects.create(
            title=title,
            type=type,
            url=url,
            roadmap_stage=stage
        )

