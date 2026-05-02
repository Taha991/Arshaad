"""
Service to fetch roadmap content from third-party APIs
Currently supports roadmap.sh structure
"""
import requests
import json
from typing import Dict, List, Optional
from django.conf import settings


class RoadmapFetcher:
    """
    Fetches roadmap content from external sources like roadmap.sh
    """
    
    # Map our tracks to roadmap.sh paths
    TRACK_MAPPING = {
        'AI/ML': 'ai-engineer',
        'Web Development': 'frontend',
        'Mobile Development': 'android',  # or 'ios'
        'Cybersecurity': 'cyber-security',
        'Data Science': 'data-analyst',
        'Cloud/DevOps': 'devops',
        'Game Development': 'game-developer',
        'Blockchain': 'blockchain',
    }
    
    def __init__(self):
        self.base_url = 'https://roadmap.sh'
        self.github_api_url = 'https://api.github.com/repos/kamranahmedse/developer-roadmap/contents'
    
    def fetch_roadmap_content(self, track: str) -> Optional[Dict]:
        """
        Fetch roadmap content for a given track
        Uses roadmap.sh structure
        """
        roadmap_path = self.TRACK_MAPPING.get(track)
        if not roadmap_path:
            return None
        
        try:
            # Try to fetch from roadmap.sh directly
            url = f"{self.base_url}/{roadmap_path}"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                # Parse the roadmap structure
                # Note: roadmap.sh doesn't have a public API, so we'll create structured data
                return self._create_structured_roadmap(track, roadmap_path)
            
        except Exception as e:
            print(f"Error fetching roadmap: {e}")
        
        # Fallback to our own structured roadmap
        return self._create_structured_roadmap(track, roadmap_path)
    
    def _create_structured_roadmap(self, track: str, roadmap_path: str) -> Dict:
        """
        Create structured roadmap data based on track
        This can be enhanced to fetch from roadmap.sh GitHub repo
        """
        # Base structure for all roadmaps
        base_stages = [
            {
                'title': 'الأساسيات',
                'description': 'تعلم الأساسيات والمفاهيم الأساسية',
                'order': 1,
                'resources': []
            },
            {
                'title': 'المستوى المتوسط',
                'description': 'بناء المشاريع وتطبيق ما تعلمته',
                'order': 2,
                'resources': []
            },
            {
                'title': 'المستوى المتقدم',
                'description': 'مشاريع متقدمة ومهارات متخصصة',
                'order': 3,
                'resources': []
            },
            {
                'title': 'التحضير للوظيفة',
                'description': 'بناء Portfolio والتحضير للمقابلات',
                'order': 4,
                'resources': []
            }
        ]
        
        # Track-specific content
        track_content = {
            'AI/ML': {
                'stages': [
                    {
                        'title': 'أساسيات البرمجة والرياضيات',
                        'description': 'Python, Linear Algebra, Statistics',
                        'order': 1,
                        'resources': [
                            {'title': 'Python Basics', 'type': 'course', 'url': 'https://www.python.org/about/gettingstarted/'},
                            {'title': 'Linear Algebra Course', 'type': 'course', 'url': 'https://www.khanacademy.org/math/linear-algebra'},
                        ]
                    },
                    {
                        'title': 'تعلم الآلة',
                        'description': 'Machine Learning Fundamentals',
                        'order': 2,
                        'resources': [
                            {'title': 'Machine Learning Course', 'type': 'course', 'url': 'https://www.coursera.org/learn/machine-learning'},
                        ]
                    },
                ]
            },
            'Game Development': {
                'stages': [
                    {
                        'title': 'أساسيات تطوير الألعاب',
                        'description': 'Game Design, Programming Basics',
                        'order': 1,
                        'resources': [
                            {'title': 'Game Development Basics', 'type': 'course', 'url': 'https://roadmap.sh/game-developer'},
                            {'title': 'Unity Learn', 'type': 'course', 'url': 'https://learn.unity.com/'},
                        ]
                    },
                    {
                        'title': 'محركات الألعاب',
                        'description': 'Unity, Unreal Engine, Godot',
                        'order': 2,
                        'resources': [
                            {'title': 'Unity Documentation', 'type': 'article', 'url': 'https://docs.unity3d.com/'},
                            {'title': 'Unreal Engine Tutorials', 'type': 'course', 'url': 'https://www.unrealengine.com/en-US/onlinelearning-courses'},
                        ]
                    },
                ]
            },
            'Web Development': {
                'stages': [
                    {
                        'title': 'HTML & CSS',
                        'description': 'أساسيات تطوير الويب',
                        'order': 1,
                        'resources': [
                            {'title': 'HTML & CSS Tutorial', 'type': 'course', 'url': 'https://roadmap.sh/frontend'},
                        ]
                    },
                ]
            },
        }
        
        # Get track-specific stages or use base
        stages = track_content.get(track, {}).get('stages', base_stages)
        
        return {
            'track': track,
            'stages': stages,
            'source': 'roadmap.sh',
            'url': f"{self.base_url}/{roadmap_path}"
        }
    
    def fetch_from_github(self, track: str) -> Optional[Dict]:
        """
        Fetch roadmap from roadmap.sh GitHub repository
        The repo has roadmap data in markdown/JSON format
        """
        roadmap_path = self.TRACK_MAPPING.get(track)
        if not roadmap_path:
            return None
        
        try:
            # GitHub API endpoint for roadmap content
            # Note: This is a placeholder - actual implementation would need to parse markdown
            github_url = f"{self.github_api_url}/content/roadmaps/{roadmap_path}.md"
            response = requests.get(github_url, timeout=10)
            
            if response.status_code == 200:
                # Parse markdown and convert to structured format
                # This would require markdown parsing
                pass
        except Exception as e:
            print(f"Error fetching from GitHub: {e}")
        
        return None

