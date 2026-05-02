import { useState, useEffect } from 'react'
import { roadmapsAPI, ApiRoadmap, ApiStage } from '@/services/api/roadmaps'
import { progressAPI, ApiStreak, ApiAchievement } from '@/services/api/progress'
import { groupsAPI, ApiStudyGroup } from '@/services/api/mentors'
import {
  mockRoadmapStages,
  mockDashboardStats,
  mockGroupMembers,
} from '@/data/mockData'

export interface DashboardData {
  roadmap: ApiRoadmap | null
  stages: ApiStage[]
  streak: ApiStreak | null
  achievements: ApiAchievement[]
  group: ApiStudyGroup | null
  stats: {
    streakDays: number
    overallProgress: number
    totalHoursLearned: number
    totalHoursTarget: number
    completedStages: number
    totalStages: number
    nextMilestone: string
    selectedTrack: string
    selectedTrackAr: string
    groupName: string
    groupNameAr: string
  }
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDashboard(): DashboardData {
  const [roadmap, setRoadmap] = useState<ApiRoadmap | null>(null)
  const [stages, setStages] = useState<ApiStage[]>([])
  const [streak, setStreak] = useState<ApiStreak | null>(null)
  const [achievements, setAchievements] = useState<ApiAchievement[]>([])
  const [group, setGroup] = useState<ApiStudyGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      const [roadmapRes, streakRes, achievementsRes, groupRes] =
        await Promise.allSettled([
          roadmapsAPI.myRoadmap(),
          progressAPI.streak(),
          progressAPI.myAchievements(),
          groupsAPI.myGroup(),
        ])

      if (roadmapRes.status === 'fulfilled') {
        setRoadmap(roadmapRes.value)
        // fetch stages separately if not embedded
        if (
          !roadmapRes.value.stages?.length &&
          roadmapRes.value.id
        ) {
          try {
            const s = await roadmapsAPI.stages(roadmapRes.value.id)
            setStages(s)
          } catch {
            setStages(mockRoadmapStages as unknown as ApiStage[])
          }
        } else {
          setStages(roadmapRes.value.stages ?? [])
        }
      } else {
        // fallback to mock
        setStages(mockRoadmapStages as unknown as ApiStage[])
      }

      if (streakRes.status === 'fulfilled') setStreak(streakRes.value)
      if (achievementsRes.status === 'fulfilled') setAchievements(achievementsRes.value)
      if (groupRes.status === 'fulfilled') setGroup(groupRes.value)
    } catch (e: any) {
      setError(e?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // ── Derived stats (real if available, mock as fallback) ──────────
  const completedStages =
    stages.filter(
      (s: any) => s.status === 'completed' || s.progress_percentage === 100
    ).length

  const totalStages = stages.length || mockRoadmapStages.length

  const overallProgress =
    roadmap?.progress_percentage ??
    mockDashboardStats.overallProgress

  const streakDays =
    streak?.current_streak ?? mockDashboardStats.streakDays

  const totalHoursLearned =
    stages.reduce(
      (acc: number, s: any) =>
        acc + Math.round(((s.estimated_hours ?? 0) * (s.progress_percentage ?? 0)) / 100),
      0
    ) || mockDashboardStats.totalHoursLearned

  const totalHoursTarget =
    stages.reduce((acc: number, s: any) => acc + (s.estimated_hours ?? 0), 0) ||
    mockDashboardStats.totalHoursTarget

  const nextStage = stages.find(
    (s: any) => s.status === 'in_progress' || s.progress_percentage === 0
  )

  const nextMilestone =
    nextStage?.title ?? mockDashboardStats.nextMilestone

  const selectedTrack =
    roadmap?.track ?? mockDashboardStats.selectedTrack

  const groupName =
    group?.name ?? mockDashboardStats.groupName

  return {
    roadmap,
    stages,
    streak,
    achievements,
    group,
    stats: {
      streakDays,
      overallProgress,
      totalHoursLearned,
      totalHoursTarget,
      completedStages,
      totalStages,
      nextMilestone,
      selectedTrack,
      selectedTrackAr: mockDashboardStats.selectedTrackAr,
      groupName,
      groupNameAr: mockDashboardStats.groupNameAr,
    },
    loading,
    error,
    refetch: fetchAll,
  }
}
