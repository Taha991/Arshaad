import client from './client'

export interface ApiMentor {
  id: number
  user?: number
  name?: string
  bio?: string
  expertise?: string[]
  rating?: number
  max_groups?: number
  current_groups?: number
  session_rate?: string
  years_experience?: number
  avatar?: string
}

export interface ApiStudyGroup {
  id: number
  name: string
  track?: string
  mentor?: number
  mentor_name?: string
  members?: number[]
  members_count?: number
  max_members?: number
  description?: string
  is_active?: boolean
}

export interface ApiGroupMembership {
  id: number
  user: number
  group: number
  role?: 'member' | 'leader'
  progress_percentage?: number
  joined_at?: string
}

export const mentorsAPI = {
  list: async (): Promise<ApiMentor[]> => {
    const { data } = await client.get('/mentors/')
    return data
  },

  get: async (id: number): Promise<ApiMentor> => {
    const { data } = await client.get(`/mentors/${id}/`)
    return data
  },
}

export const groupsAPI = {
  list: async (): Promise<ApiStudyGroup[]> => {
    const { data } = await client.get('/study-groups/')
    return data
  },

  get: async (id: number): Promise<ApiStudyGroup> => {
    const { data } = await client.get(`/study-groups/${id}/`)
    return data
  },

  myGroup: async (): Promise<ApiStudyGroup> => {
    const { data } = await client.get('/study-groups/my_group/')
    return data
  },

  members: async (groupId: number): Promise<ApiGroupMembership[]> => {
    const { data } = await client.get(`/study-groups/${groupId}/members/`)
    return data
  },

  join: async (groupId: number): Promise<ApiGroupMembership> => {
    const { data } = await client.post(`/study-groups/${groupId}/join/`)
    return data
  },

  leave: async (groupId: number): Promise<void> => {
    await client.post(`/study-groups/${groupId}/leave/`)
  },
}
