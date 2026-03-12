/*
 * Copyright (c) 2026 FalkenDev
 *
 * This file is part of Trainity.
 *
 * Trainity is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with Trainity. If not, see
 * <https://www.gnu.org/licenses/>.
 */

import { fetchWrapper } from '@/utils/fetchWrapper'
import type {
  WeightLog,
  WeightLogStats,
  CreateWeightLogDto,
  UpdateWeightLogDto,
} from '@/interfaces/WeightLog.interface'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1'

export const fetchAllWeightLogs = async () => {
  try {
    const data = await fetchWrapper<WeightLog[]>(`${apiUrl}/weight-logs`)
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching weight logs:', error)
    throw new Error('Failed to fetch weight logs')
  }
}

export const fetchWeightLogStats = async () => {
  try {
    return await fetchWrapper<WeightLogStats>(`${apiUrl}/weight-logs/stats`)
  } catch (error) {
    console.error('Error fetching weight log stats:', error)
    throw new Error('Failed to fetch weight log stats')
  }
}

export const createWeightLog = async (dto: CreateWeightLogDto) => {
  try {
    return await fetchWrapper<WeightLog>(`${apiUrl}/weight-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
  } catch (error) {
    console.error('Error creating weight log:', error)
    throw new Error('Failed to create weight log')
  }
}

export const updateWeightLog = async (id: number, dto: UpdateWeightLogDto) => {
  try {
    return await fetchWrapper<WeightLog>(`${apiUrl}/weight-logs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    })
  } catch (error) {
    console.error('Error updating weight log:', error)
    throw new Error('Failed to update weight log')
  }
}

export const deleteWeightLog = async (id: number) => {
  try {
    await fetchWrapper(`${apiUrl}/weight-logs/${id}`, { method: 'DELETE' })
  } catch (error) {
    console.error('Error deleting weight log:', error)
    throw new Error('Failed to delete weight log')
  }
}
