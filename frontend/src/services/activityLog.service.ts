/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Grindify.
 *
 * Grindify is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Grindify. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { fetchWrapper } from '@/utils/fetchWrapper'
import type {
  ActivityLog,
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from '@/interfaces/Activity.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

export const fetchAllActivityLogs = async () => {
  try {
    const data = await fetchWrapper<ActivityLog[]>(`${apiUrl}/activityLog`)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching activity logs:', error)
    throw new Error('Failed to fetch activity logs')
  }
}

export const fetchActivityLogById = async (logId: number) => {
  try {
    const data = await fetchWrapper<ActivityLog>(`${apiUrl}/activityLog/${logId}`)
    return data
  } catch (error) {
    console.error('Error fetching activity log:', error)
    throw new Error('Failed to fetch activity log')
  }
}

export const createActivityLog = async (log: CreateActivityLogDto) => {
  try {
    const data = await fetchWrapper<ActivityLog>(`${apiUrl}/activityLog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    })
    return data
  } catch (error) {
    console.error('Error creating activity log:', error)
    throw new Error('Failed to create activity log')
  }
}

export const deleteActivityLog = async (logId: number) => {
  try {
    await fetchWrapper(`${apiUrl}/activityLog/${logId}`, {
      method: 'DELETE',
    })
  } catch (error) {
    console.error('Error deleting activity log:', error)
    throw new Error('Failed to delete activity log')
  }
}

export const updateActivityLog = async (logId: number, dto: UpdateActivityLogDto) => {
  try {
    const data = await fetchWrapper<ActivityLog>(`${apiUrl}/activityLog/${logId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
    return data
  } catch (error) {
    console.error('Error updating activity log:', error)
    throw new Error('Failed to update activity log')
  }
}
