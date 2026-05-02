import client from './client'

export interface ApiJob {
  id: number
  title: string
  company: string
  location?: string
  salary_min?: number
  salary_max?: number
  job_type?: string
  track?: string
  skills_required?: string[]
  description?: string
  apply_url?: string
  posted_at?: string
  is_remote?: boolean
}

export interface ApiMarketAnalytics {
  id: number
  track: string
  avg_salary?: number
  min_salary?: number
  max_salary?: number
  demand_score?: number
  job_count?: number
  growth_percent?: number
  top_skills?: string[]
  updated_at?: string
}

export const jobsAPI = {
  list: async (params?: { track?: string; is_remote?: boolean; search?: string }): Promise<ApiJob[]> => {
    const { data } = await client.get('/jobs/', { params })
    return data
  },

  get: async (id: number): Promise<ApiJob> => {
    const { data } = await client.get(`/jobs/${id}/`)
    return data
  },
}

export const marketAPI = {
  analytics: async (): Promise<ApiMarketAnalytics[]> => {
    const { data } = await client.get('/market-analytics/')
    return data
  },

  byTrack: async (track: string): Promise<ApiMarketAnalytics> => {
    const { data } = await client.get('/market-analytics/', { params: { track } })
    return Array.isArray(data) ? data[0] : data
  },
}
