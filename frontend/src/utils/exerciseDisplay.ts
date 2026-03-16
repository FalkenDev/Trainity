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

import type { Composer } from 'vue-i18n'

import type { Exercise } from '@/interfaces/Exercise.interface'

type Translator = Pick<Composer, 't'>

function translatedOrFallback(translator: Translator, key: string, fallback: string): string {
  const translated = translator.t(key)
  return translated === key ? fallback : translated
}

export function displayExerciseName(
  translator: Translator,
  exercise: Pick<Exercise, 'name' | 'i18nKey' | 'isNameCustom'>
): string {
  if (exercise.isNameCustom && exercise.name) return exercise.name
  if (exercise.i18nKey)
    return translatedOrFallback(translator, `${exercise.i18nKey}.name`, exercise.name)
  return exercise.name
}

export function displayExerciseDescription(
  translator: Translator,
  exercise: Pick<Exercise, 'description' | 'i18nKey'>,
  fallback: string
): string {
  const current = (exercise.description ?? '').trim()
  if (exercise.i18nKey)
    return translatedOrFallback(translator, `${exercise.i18nKey}.description`, current || fallback)
  return current || fallback
}
