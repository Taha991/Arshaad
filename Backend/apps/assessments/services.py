from decimal import Decimal
from .models import Assessment, Recommendation
from apps.roadmaps.models import Roadmap
from apps.ai.services import AIService


class RecommendationService:
    """
    AI Recommendation Engine
    Simple scoring-based approach (can be replaced with ML model later)
    """
    
    TRACKS = ['AI/ML', 'Web Development', 'Mobile Development', 'Cybersecurity', 
              'Data Science', 'Cloud/DevOps', 'Game Development', 'Blockchain']
    
    def generate_recommendation(self, assessment: Assessment) -> Recommendation:
        """
        Generate recommendation based on assessment answers using AI model
        """
        answers_data = assessment.answers_json
        
        # Extract answers and study year
        study_year = answers_data.get('study_year')
        answers_raw = answers_data.get('answers', {})
        
        # Convert string keys to integers (frontend sends "1", "2" but model expects 1, 2)
        answers = {}
        for k, v in answers_raw.items():
            if isinstance(k, str) and k.isdigit():
                answers[int(k)] = v
            elif isinstance(k, int):
                answers[k] = v
        
        # Use AI service to generate recommendations
        ai_service = AIService()
        recommendations = ai_service.generate_track_recommendations(answers, study_year)
        
        if not recommendations:
            # Fallback to old method if AI fails
            return self._generate_recommendation_fallback(assessment)
        
        # Top recommendation
        top_rec = recommendations[0]
        
        # Alternative tracks (2nd and 3rd)
        alternatives = [
            {'track': rec['track'], 'score': rec['confidence']}
            for rec in recommendations[1:3]
        ]
        
        # Create recommendation record
        recommendation = Recommendation.objects.create(
            user=assessment.user,
            assessment=assessment,
            track=top_rec['track'],
            confidence=Decimal(str(top_rec['confidence'])),
            model_version='ai-v1.0',
            alternative_tracks=alternatives,
            personalization_factors={
                'study_year': study_year,
                'answers_summary': {
                    'agree_count': sum(1 for v in answers.values() if v == 'agree'),
                    'disagree_count': sum(1 for v in answers.values() if v == 'disagree'),
                }
            },
            explanation=top_rec['explanation']
        )
        
        return recommendation
    
    def _generate_recommendation_fallback(self, assessment: Assessment) -> Recommendation:
        """
        Fallback method using rule-based scoring (if AI fails)
        """
        answers = assessment.answers_json
        
        # Calculate scores for each track
        track_scores = {}
        for track in self.TRACKS:
            track_scores[track] = self._calculate_track_score(track, answers)
        
        # Get top track
        top_track = max(track_scores.items(), key=lambda x: x[1])
        
        # Get alternatives
        sorted_tracks = sorted(track_scores.items(), key=lambda x: x[1], reverse=True)
        alternatives = [{'track': track, 'score': float(score)} for track, score in sorted_tracks[1:3]]
        
        confidence = Decimal(str((top_track[1] / 100) * 100)).quantize(Decimal('0.01'))
        explanation = self._generate_explanation(top_track[0], answers, top_track[1])
        
        recommendation = Recommendation.objects.create(
            user=assessment.user,
            assessment=assessment,
            track=top_track[0],
            confidence=confidence,
            model_version='rule-based-v1.0',
            alternative_tracks=alternatives,
            explanation=explanation
        )
        
        return recommendation
    
    def _calculate_track_score(self, track: str, answers: dict) -> float:
        """
        Calculate score for a specific track based on answers
        Simple rule-based scoring (can be replaced with ML model)
        """
        score = 0.0
        
        # Handle new assessment format (10 questions with agree/disagree)
        if 'answers' in answers:
            question_answers = answers.get('answers', {})
            
            # Map questions to tracks
            # Question 1: Creative/Innovative → AI/ML, Game Development
            if question_answers.get(1) == 'agree':
                if track in ['AI/ML', 'Game Development']:
                    score += 15
            
            # Question 2: Team work → All tracks benefit
            if question_answers.get(2) == 'agree':
                score += 5
            
            # Question 3: UI/UX → Web Development, Mobile Development
            if question_answers.get(3) == 'agree':
                if track in ['Web Development', 'Mobile Development']:
                    score += 20
            
            # Question 4: Data analysis → Data Science, AI/ML
            if question_answers.get(4) == 'agree':
                if track in ['Data Science', 'AI/ML']:
                    score += 20
            
            # Question 5: Security → Cybersecurity
            if question_answers.get(5) == 'agree':
                if track == 'Cybersecurity':
                    score += 25
            
            # Question 6: Complex projects → All advanced tracks
            if question_answers.get(6) == 'agree':
                if track in ['AI/ML', 'Cloud/DevOps', 'Blockchain']:
                    score += 10
            
            # Question 7: Continuous learning → All tracks
            if question_answers.get(7) == 'agree':
                score += 5
            
            # Question 8: Mobile apps → Mobile Development
            if question_answers.get(8) == 'agree':
                if track == 'Mobile Development':
                    score += 25
            
            # Question 9: Performance optimization → Cloud/DevOps, Web Development
            if question_answers.get(9) == 'agree':
                if track in ['Cloud/DevOps', 'Web Development']:
                    score += 15
            
            # Question 10: AI/ML → AI/ML
            if question_answers.get(10) == 'agree':
                if track == 'AI/ML':
                    score += 25
            
            return min(score, 100)  # Cap at 100
        
        # Old format (backward compatibility)
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
        
        skill_level = answers.get('skill_level', 'beginner')
        if skill_level == 'intermediate':
            score += 10
        elif skill_level == 'advanced':
            score += 20
        
        weekly_hours = answers.get('weekly_study_hours', 0)
        score += min(weekly_hours / 2, 15)
        
        return min(score, 100)
    
    def _generate_explanation(self, track: str, answers: dict, score: float) -> str:
        """
        Generate human-readable explanation for the recommendation
        """
        # Handle new format with 10 questions
        if 'answers' in answers:
            question_answers = answers.get('answers', {})
            agree_count = sum(1 for v in question_answers.values() if v == 'agree')
            
            explanation = f"بناءً على إجاباتك، نوصي بمسار {track}. "
            explanation += f"إجاباتك تظهر اهتمامًا قويًا بهذا المجال "
            explanation += f"مع نسبة توافق {score:.1f}%."
            
            return explanation
        
        # Old format (backward compatibility)
        interests = answers.get('interests', [])
        skill_level = answers.get('skill_level', 'beginner')
        
        explanation = f"Based on your assessment, we recommend {track}. "
        explanation += f"Your interests align well with this field, and your {skill_level} skill level "
        explanation += f"makes this a great starting point. "
        explanation += f"With a compatibility score of {score:.1f}%, this track matches your profile."
        
        return explanation


