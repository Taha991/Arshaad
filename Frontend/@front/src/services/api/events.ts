import client from './client'

export interface ApiEvent {
  id: number
  title: string
  description?: string
  category?: string
  event_date?: string
  location?: string
  is_online?: boolean
  registration_url?: string
  speaker?: string
  tags?: string[]
  spots_left?: number
  total_spots?: number
}

export interface ApiNotification {
  id: number
  title: string
  message?: string
  type?: string
  is_read?: boolean
  created_at?: string
}

export const eventsAPI = {
  list: async (params?: { category?: string; is_online?: boolean }): Promise<ApiEvent[]> => {
    const { data } = await client.get('/events/', { params })
    return data
  },

  get: async (id: number): Promise<ApiEvent> => {
    const { data } = await client.get(`/events/${id}/`)
    return data
  },

  register: async (id: number): Promise<void> => {
    await client.post(`/events/${id}/register/`)
  },
}

export const notificationsAPI = {
  list: async (): Promise<ApiNotification[]> => {
    const { data } = await client.get('/notifications/')
    return data
  },

  markRead: async (id: number): Promise<void> => {
    await client.patch(`/notifications/${id}/`, { is_read: true })
  },

  markAllRead: async (): Promise<void> => {
    await client.post('/notifications/mark_all_read/')
  },
}
