"""
AI Services for Career Track Recommendations
"""
from typing import Dict, List, Tuple
from apps.ai.inference.recommendation_model import get_recommender_model


class AIService:
    """
    Service layer for AI/ML operations
    """
    
    def __init__(self):
        self.model = get_recommender_model()
    
    def generate_track_recommendations(
        self,
        answers: Dict[int, str],
        study_year: int = None
    ) -> List[Dict[str, any]]:
        """
        Generate top 3 career track recommendations using AI model
        
        Args:
            answers: Dictionary mapping question_id to 'agree'/'disagree'
            study_year: Optional study year (1-6)
            
        Returns:
            List of recommendation dicts with track, confidence, and explanation
        """
        # Get predictions from model
        predictions = self.model.predict(answers, study_year)
        
        # Format recommendations
        recommendations = []
        for idx, (track, confidence) in enumerate(predictions):
            recommendation = {
                'track': track,
                'confidence': round(confidence, 2),
                'rank': idx + 1,
                'explanation': self._generate_explanation(track, confidence, answers, idx == 0)
            }
            recommendations.append(recommendation)
        
        return recommendations
    
    def _generate_explanation(
        self,
        track: str,
        confidence: float,
        answers: Dict[int, str],
        is_top: bool
    ) -> str:
        """
        Generate human-readable explanation for the recommendation
        """
        agree_count = sum(1 for v in answers.values() if v == 'agree')
        
        if is_top:
            explanation = f"بناءً على إجاباتك، نوصي بشدة بمسار {track}. "
        else:
            explanation = f"مسار {track} مناسب لك أيضًا. "
        
        explanation += f"إجاباتك تظهر اهتمامًا قويًا بهذا المجال "
        explanation += f"مع نسبة توافق {confidence:.1f}%."
        
        # Add specific insights based on track
        track_insights = {
            'AI/ML': "مجال متطور سريعًا مع فرص عمل ممتازة في المستقبل.",
            'Web Development': "مجال واسع مع طلب كبير في السوق.",
            'Mobile Development': "مجال متنامي مع انتشار الهواتف الذكية.",
            'Cybersecurity': "مجال حيوي ومطلوب بشدة في جميع القطاعات.",
            'Data Science': "مجال يجمع بين البرمجة والتحليل والإحصاء.",
            'Cloud/DevOps': "مجال تقني متقدم مع رواتب ممتازة.",
            'Game Development': "مجال إبداعي يجمع بين البرمجة والفن.",
            'Blockchain': "مجال حديث ومبتكر مع إمكانيات كبيرة.",
        }
        
        explanation += " " + track_insights.get(track, "")
        
        return explanation
    
    def train_model(self, training_data: List[Dict]):
        """
        Train the recommendation model on historical data
        
        Args:
            training_data: List of training examples with 'answers' and 'selected_track'
        """
        self.model.train(training_data)
    
    def update_model_weights(self, feedback_data: List[Dict]):
        """
        Update model based on user feedback
        
        Args:
            feedback_data: List of feedback with 'recommendation_id', 'selected_track', 'feedback_score'
        """
        # This would implement reinforcement learning or feedback-based updates
        pass

