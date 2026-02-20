import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ProgressPhoto, CreateProgressPhotoDto } from '@/interfaces/ProgressPhoto.interface'
import * as progressPhotoService from '@/services/progressPhoto.service'
import { useAuthStore } from './auth.store'

export const useProgressPhotoStore = defineStore('progressPhotoStore', () => {
  const authStore = useAuthStore()

  const photos = ref<ProgressPhoto[]>([])
  const isLoading = ref(false)
  const lastFetched = ref<number | null>(null)
  const cacheDuration = 30 * 1000 // 30 seconds

  const fetchPhotos = async (reload = false) => {
    const now = Date.now()
    if (
      photos.value.length > 0 &&
      !reload &&
      lastFetched.value &&
      now - lastFetched.value < cacheDuration
    )
      return

    try {
      isLoading.value = true
      photos.value = await progressPhotoService.fetchAllProgressPhotos()
      lastFetched.value = now
    } catch (err) {
      console.error('Error fetching progress photos:', err)
    } finally {
      isLoading.value = false
    }
  }

  const uploadPhoto = async (file: File, dto: CreateProgressPhotoDto) => {
    const photo = await progressPhotoService.uploadProgressPhoto(file, dto)
    photos.value = [photo, ...photos.value]
    return photo
  }

  const deletePhoto = async (id: number) => {
    await progressPhotoService.deleteProgressPhoto(id)
    photos.value = photos.value.filter(p => p.id !== id)
  }

  watch(
    () => authStore.isAuthenticated,
    authed => {
      if (authed) void fetchPhotos(true)
    },
    { immediate: true }
  )

  const resetStore = () => {
    photos.value = []
    isLoading.value = false
    lastFetched.value = null
  }

  return { photos, isLoading, fetchPhotos, uploadPhoto, deletePhoto, resetStore }
})
