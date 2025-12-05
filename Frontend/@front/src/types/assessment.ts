export interface Assessment {
  id: number
  user: number
  version: string
  answers_json: {
    study_year?: number
    answers?: Record<number, 'agree' | 'disagree'>
    question_ids?: number[]
    [key: string]: any
  }
  score_vector?: any
  personality_traits?: any
  skill_levels?: any
  interests_vector?: any
  completion_time_seconds?: number
  created_at: string
}

export interface Recommendation {
  id: number
  user: number
  assessment: number
  track: string
  confidence: number
  model_version: string
  explanation: string
  alternative_tracks?: Array<{
    track: string
    score: number
  }>
  personalization_factors?: any
  feedback_score?: number
  created_at: string
}

