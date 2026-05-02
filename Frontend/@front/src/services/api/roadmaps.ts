import client from './client'

export interface ApiStage {
  id: number
  title: string
  title_ar?: string
  description?: string
  stage_order: number
  estimated_hours?: number
  status?: 'completed' | 'in_progress' | 'locked'
  progress_percentage?: number
  skills?: string[]
}

export interface ApiRoadmap {
  id: number
  title: string
  track: string
  total_stages?: number
  completed_stages?: number
  progress_percentage?: number
  stages?: ApiStage[]
}

export const roadmapsAPI = {
  list: async (): Promise<ApiRoadmap[]> => {
    const { data } = await client.get('/roadmaps/')
    return data
  },

  get: async (id: number): Promise<ApiRoadmap> => {
    const { data } = await client.get(`/roadmaps/${id}/`)
    return data
  },

  myRoadmap: async (): Promise<ApiRoadmap> => {
    const { data } = await client.get('/roadmaps/my_roadmap/')
    return data
  },

  stages: async (id: number): Promise<ApiStage[]> => {
    const { data } = await client.get(`/roadmaps/${id}/stages/`)
    return data
  },

  allStages: async (): Promise<ApiStage[]> => {
    const { data } = await client.get('/stages/')
    return data
  },

  resources: async (params?: { is_free?: boolean; type?: string }): Promise<any[]> => {
    const { data } = await client.get('/resources/', { params })
    return data
  },
}
