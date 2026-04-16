import api from './auth'
import { Assessment, Recommendation } from '../../types/assessment'

export const assessmentsAPI = {
  createAssessment: async (data: any): Promise<Assessment> => {
    const response = await api.post<Assessment>('/assessments/', data)
    return response.data
  },

  generateRecommendation: async (assessmentId: number): Promise<Recommendation> => {
    const response = await api.post<Recommendation>(
      `/assessments/${assessmentId}/generate_recommendation/`,
      {}
    )
    return response.data
  },

  getRecommendations: async (): Promise<Recommendation[]> => {
    const response = await api.get<Recommendation[]>('/recommendations/')
    return response.data
  },
}

