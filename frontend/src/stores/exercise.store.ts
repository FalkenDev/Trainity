// stores/authStore.ts
import { defineStore } from 'pinia'

export const useExerciseStore = defineStore(
  'exerciseStore',
  () => {
    const exercises = ref([])
        const isLoading = ref<boolean>(false)
    const lastFetched = ref<number | null>(null)
    const cacheDuration = 10 * 1000

    const setExercises = async (reload = false) => {
      const now = Date.now()
      if (exercises.value && !reload && lastFetched.value && (now - lastFetched.value) < cacheDuration) {
        return
      }

      try {
        isLoading.value = true
        exercises.value = await exerciseService.getAllBookingsCollectionCities()
        lastFetched.value = now
      }
      catch (error) {
        console.error('Error fetching bookingCollectionCities:', error)
      }
      finally {
        isLoading.value = false
      }
    }

    setExercises()

    return { exercises, isLoading, setExercises }
  },
  {
    persist: true,
  },
)
