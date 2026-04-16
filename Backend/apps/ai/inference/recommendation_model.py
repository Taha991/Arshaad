"""
AI Recommendation Model
Trains and predicts career tracks based on assessment answers
"""
from typing import Dict, List, Tuple
import json
import os
from pathlib import Path


class CareerTrackRecommender:
    """
    ML Model for recommending career tracks based on assessment answers
    Uses a simple neural network or decision tree approach
    """
    
    TRACKS = [
        'AI/ML',
        'Web Development',
        'Mobile Development',
        'Cybersecurity',
        'Data Science',
        'Cloud/DevOps',
        'Game Development',
        'Blockchain'
    ]
    
    def __init__(self, model_path: str = None):
        """
        Initialize the recommender model
        If model_path is provided, load existing model, otherwise use default weights
        """
        self.model_path = model_path
        self.weights = self._initialize_weights()
        self.track_mapping = {track: idx for idx, track in enumerate(self.TRACKS)}
        
    def _initialize_weights(self) -> List[List[float]]:
        """
        Initialize model weights based on question-to-track mapping
        Each question contributes differently to each track
        """
        # 10 questions, 8 tracks
        # Weights: [question_id][track_id] = weight
        weights = [
            # Q1: Creative/Innovative → AI/ML, Game Dev
            [0.8, 0.2, 0.3, 0.1, 0.4, 0.2, 0.9, 0.3],
            # Q2: Team work → All tracks benefit
            [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
            # Q3: UI/UX → Web Dev, Mobile Dev
            [0.1, 0.9, 0.9, 0.1, 0.2, 0.2, 0.4, 0.1],
            # Q4: Data analysis → Data Science, AI/ML
            [0.8, 0.2, 0.1, 0.1, 0.9, 0.3, 0.1, 0.2],
            # Q5: Security → Cybersecurity
            [0.2, 0.2, 0.2, 0.95, 0.3, 0.4, 0.1, 0.3],
            # Q6: Complex projects → AI/ML, Cloud/DevOps, Blockchain
            [0.7, 0.4, 0.3, 0.5, 0.5, 0.8, 0.4, 0.7],
            # Q7: Continuous learning → All tracks
            [0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
            # Q8: Mobile apps → Mobile Development
            [0.1, 0.3, 0.95, 0.1, 0.1, 0.2, 0.2, 0.1],
            # Q9: Performance → Cloud/DevOps, Web Dev
            [0.2, 0.7, 0.4, 0.3, 0.3, 0.9, 0.2, 0.3],
            # Q10: AI/ML → AI/ML
            [0.95, 0.1, 0.1, 0.1, 0.6, 0.2, 0.1, 0.2],
        ]
        
        return weights
    
    def predict(self, answers: Dict[int, str], study_year: int = None) -> List[Tuple[str, float]]:
        """
        Predict top 3 career tracks based on assessment answers
        
        Args:
            answers: Dictionary mapping question_id (1-10) to 'agree' or 'disagree'
            study_year: Optional study year (1-6) for additional weighting
            
        Returns:
            List of tuples (track_name, confidence_score) sorted by confidence
        """
        # Convert answers to feature vector
        features = [0.0] * 10
        for q_id, answer in answers.items():
            # Handle both string and int keys
            q_id_int = int(q_id) if isinstance(q_id, str) and q_id.isdigit() else q_id
            if isinstance(q_id_int, int) and 1 <= q_id_int <= 10:
                # 1 for agree, -0.5 for disagree, 0 for not answered
                features[q_id_int - 1] = 1.0 if answer == 'agree' else -0.5
        
        # Calculate scores for each track (matrix multiplication)
        track_scores = [0.0] * 8
        for track_idx in range(8):
            score = 0.0
            for q_idx in range(10):
                score += features[q_idx] * self.weights[q_idx][track_idx]
            track_scores[track_idx] = score
        
        # Normalize scores to 0-100 range
        min_score = min(track_scores)
        max_score = max(track_scores)
        if max_score > min_score:
            track_scores = [((score - min_score) / (max_score - min_score)) * 100 for score in track_scores]
        else:
            track_scores = [50.0] * 8  # Default to 50% if all same
        
        # Apply study year adjustment (higher years get slight boost)
        if study_year:
            year_factor = 1.0 + (study_year - 1) * 0.05  # 5% boost per year
            track_scores = [min(100, max(0, score * year_factor)) for score in track_scores]
        
        # Get top 3 tracks
        track_with_scores = list(zip(self.TRACKS, track_scores))
        track_with_scores.sort(key=lambda x: x[1], reverse=True)
        recommendations = track_with_scores[:3]
        
        return recommendations
    
    def train(self, training_data: List[Dict], epochs: int = 100):
        """
        Train the model on historical data
        This is a placeholder for actual ML training
        
        Args:
            training_data: List of dicts with 'answers' and 'selected_track'
            epochs: Number of training epochs
        """
        # This would implement actual training logic
        # For now, we use rule-based weights
        # In production, you'd use scikit-learn, TensorFlow, or PyTorch
        pass
    
    def save_model(self, path: str):
        """Save model weights to file"""
        model_data = {
            'weights': self.weights,
            'tracks': self.TRACKS,
            'version': '1.0'
        }
        with open(path, 'w') as f:
            json.dump(model_data, f)
    
    def load_model(self, path: str):
        """Load model weights from file"""
        with open(path, 'r') as f:
            model_data = json.load(f)
        self.weights = model_data['weights']
        self.TRACKS = model_data['tracks']


# Global model instance
_recommender_model = None


def get_recommender_model() -> CareerTrackRecommender:
    """Get or create the global recommender model instance"""
    global _recommender_model
    if _recommender_model is None:
        _recommender_model = CareerTrackRecommender()
    return _recommender_model

