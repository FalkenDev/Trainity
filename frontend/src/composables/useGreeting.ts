import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { StreakInfo } from '@/interfaces/User.interface'

/**
 * Pick a deterministic-random element from a pool, stable per calendar day.
 */
function pickFromPool(pool: unknown[], dayOfYear: number): string {
  if (!Array.isArray(pool) || pool.length === 0) return ''
  return String(pool[dayOfYear % pool.length])
}

/**
 * Returns a reactive greeting string based on (in priority order):
 *  1. Streak milestones (7, 14, 30, 100+) — shown for 3 days after milestone
 *  2. Weekly goal hit / one session away
 *  3. Day-of-week (Monday, Friday, weekend)
 *  4. Time-of-day (morning, afternoon, evening, night)
 *
 * The random pick within each pool is seeded by the day-of-year
 * so the message stays consistent throughout a given day.
 */
export function useGreeting(streakInfo: Ref<StreakInfo | null>) {
  const { t, tm } = useI18n({ useScope: 'global' })

  /** Safely resolve a tm() key to a string array (mirrors ProgressBar pattern). */
  function getPool(key: string): string[] {
    const v = tm(key)
    return Array.isArray(v) ? (v as string[]) : []
  }

  const greeting = computed(() => {
    const info = streakInfo.value
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay() // 0 = Sunday

    // Stable seed based on day-of-year
    const startOfYear = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

    // ── Priority 1: Streak milestones (visible for 3 days after milestone) ──
    if (info) {
      const s = info.currentStreak
      if (s >= 100) return t('greetings.streak100', { streak: s })
      if (s >= 30 && s <= 32) return t('greetings.streak30', { streak: s })
      if (s >= 14 && s <= 16) return t('greetings.streak14', { streak: s })
      if (s >= 7 && s <= 9) return t('greetings.streak7', { streak: s })
    }

    // ── Priority 2: Weekly goal status ──
    if (info && info.weeklyWorkoutGoal > 0) {
      if (info.currentWeekWorkouts >= info.weeklyWorkoutGoal) {
        return t('greetings.goalHit')
      }
      if (info.currentWeekWorkouts === info.weeklyWorkoutGoal - 1) {
        return t('greetings.goalClose')
      }
    }

    // ── Priority 3: Day-specific quotes ──
    if (day === 1) {
      const pool = getPool('greetings.monday')
      if (pool.length) return pickFromPool(pool, dayOfYear)
    }
    if (day === 5) {
      const pool = getPool('greetings.friday')
      if (pool.length) return pickFromPool(pool, dayOfYear)
    }
    if (day === 0 || day === 6) {
      const pool = getPool('greetings.weekend')
      if (pool.length) return pickFromPool(pool, dayOfYear)
    }

    // ── Priority 4: Time-of-day quotes ──
    let timeKey: string
    if (hour >= 5 && hour < 12) timeKey = 'morning'
    else if (hour >= 12 && hour < 17) timeKey = 'afternoon'
    else if (hour >= 17 && hour < 21) timeKey = 'evening'
    else timeKey = 'night'

    const pool = getPool(`greetings.${timeKey}`)
    if (pool.length) return pickFromPool(pool, dayOfYear)

    // ── Fallback ──
    return t('home.ready')
  })

  return { greeting }
}
