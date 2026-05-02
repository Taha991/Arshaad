import client from './client'

export interface ApiProgress {
  id: number
  resource: number
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  time_spent_minutes?: number
  notes?: string
  updated_at?: string
}

export interface ApiStreak {
  current_streak: number
  longest_streak: number
  last_activity?: string
}

export interface ApiAchievement {
  id: number
  name: string
  description?: string
  icon?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  earned_at?: string
}

export interface ApiStudySession {
  id?: number
  resource: number
  duration_minutes: number
  quality_rating?: number
  notes?: string
  tags?: string[]
}

export const progressAPI = {
  list: async (): Promise<ApiProgress[]> => {
    const { data } = await client.get('/progress/')
    return data
  },

  create: async (payload: Omit<ApiProgress, 'id'>): Promise<ApiProgress> => {
    const { data } = await client.post('/progress/', payload)
    return data
  },

  update: async (id: number, payload: Partial<ApiProgress>): Promise<ApiProgress> => {
    const { data } = await client.patch(`/progress/${id}/`, payload)
    return data
  },

  streak: async (): Promise<ApiStreak> => {
    const { data } = await client.get('/streaks/')
    return data
  },

  achievements: async (): Promise<ApiAchievement[]> => {
    const { data } = await client.get('/achievements/')
    return data
  },

  myAchievements: async (): Promise<ApiAchievement[]> => {
    const { data } = await client.get('/user-achievements/')
    return data
  },

  logSession: async (payload: ApiStudySession): Promise<ApiStudySession> => {
    const { data } = await client.post('/sessions/', payload)
    return data
  },
}
