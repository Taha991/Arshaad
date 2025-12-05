from decimal import Decimal
from .models import Assessment, Recommendation
from apps.roadmaps.models import Roadmap


class RecommendationService:
    """
    AI Recommendation Engine
    Simple scoring-based approach (can be replaced with ML model later)
    """
    
    TRACKS = ['AI/ML', 'Web Development', 'Mobile Development', 'Cybersecurity', 
              'Data Science', 'Cloud/DevOps', 'Game Development', 'Blockchain']
    
    def generate_recommendation(self, assessment: Assessment) -> Recommendation:
        """
        Generate recommendation based on assessment answers
        """
        answers = assessment.answers_json
        
        # Calculate scores for each track
        track_scores = {}
        for track in self.TRACKS:
            track_scores[track] = self._calculate_track_score(track, answers)
        
        # Get top track
        top_track = max(track_scores.items(), key=lambda x: x[1])
        
        # Get alternatives (top 3)
        sorted_tracks = sorted(track_scores.items(), key=lambda x: x[1], reverse=True)
        alternatives = [{'track': track, 'score': float(score)} for track, score in sorted_tracks[1:4]]
        
        # Calculate confidence (normalize score to 0-100)
        max_possible_score = 100
        confidence = Decimal(str((top_track[1] / max_possible_score) * 100)).quantize(Decimal('0.01'))
        
        # Generate explanation
        explanation = self._generate_explanation(top_track[0], answers, top_track[1])
        
        # Create recommendation
        recommendation = Recommendation.objects.create(
            user=assessment.user,
            assessment=assessment,
            track=top_track[0],
            confidence=confidence,
            alternative_tracks=alternatives,
            personalization_factors={
                'skill_level': answers.get('skill_level', 'beginner'),
                'interests': answers.get('interests', []),
                'learning_style': answers.get('learning_style', 'visual'),
            },
            explanation=explanation
        )
        
        return recommendation
    
    def _calculate_track_score(self, track: str, answers: dict) -> float:
        """
        Calculate score for a specific track based on answers
        Simple rule-based scoring (can be replaced with ML model)
        """
        score = 0.0
        
        # Interest matching
        interests = answers.get('interests', [])
        track_keywords = {
            'AI/ML': ['ai', 'machine learning', 'deep learning', 'neural networks', 'data'],
            'Web Development': ['web', 'frontend', 'backend', 'fullstack', 'react', 'vue', 'angular'],
            'Mobile Development': ['mobile', 'ios', 'android', 'flutter', 'react native'],
            'Cybersecurity': ['security', 'cyber', 'penetration', 'ethical hacking', 'network'],
            'Data Science': ['data', 'analytics', 'statistics', 'python', 'sql'],
            'Cloud/DevOps': ['cloud', 'devops', 'aws', 'azure', 'docker', 'kubernetes'],
            'Game Development': ['game', 'unity', 'unreal', 'graphics', '3d'],
            'Blockchain': ['blockchain', 'crypto', 'smart contracts', 'web3', 'ethereum'],
        }
        
        keywords = track_keywords.get(track, [])
        for interest in interests:
            if any(keyword.lower() in str(interest).lower() for keyword in keywords):
                score += 20
        
        # Skill level adjustment
        skill_level = answers.get('skill_level', 'beginner')
        if skill_level == 'intermediate':
            score += 10
        elif skill_level == 'advanced':
            score += 20
        
        # Study hours (more hours = higher score for commitment)
        weekly_hours = answers.get('weekly_study_hours', 0)
        score += min(weekly_hours / 2, 15)  # Max 15 points
        
        return min(score, 100)  # Cap at 100
    
    def _generate_explanation(self, track: str, answers: dict, score: float) -> str:
        """
        Generate human-readable explanation for the recommendation
        """
        interests = answers.get('interests', [])
        skill_level = answers.get('skill_level', 'beginner')
        
        explanation = f"Based on your assessment, we recommend {track}. "
        explanation += f"Your interests align well with this field, and your {skill_level} skill level "
        explanation += f"makes this a great starting point. "
        explanation += f"With a compatibility score of {score:.1f}%, this track matches your profile."
        
        return explanation


