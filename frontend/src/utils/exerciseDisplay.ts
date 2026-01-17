import type { Composer } from 'vue-i18n';

import type { Exercise } from '@/interfaces/Exercise.interface';
import type { GlobalExercise } from '@/interfaces/GlobalExercise.interface';

type Translator = Pick<Composer, 't'>;

function translatedOrFallback(translator: Translator, key: string, fallback: string): string {
  const translated = translator.t(key);
  return translated === key ? fallback : translated;
}

export function displayExerciseName(translator: Translator, exercise: Pick<Exercise, 'name' | 'i18nKey' | 'isNameCustom'>): string {
  if (exercise.isNameCustom && exercise.name) return exercise.name;
  if (exercise.i18nKey) return translatedOrFallback(translator, `${exercise.i18nKey}.name`, exercise.name);
  return exercise.name;
}

export function displayExerciseDescription(
  translator: Translator,
  exercise: Pick<Exercise, 'description' | 'i18nKey'>,
  fallback: string,
): string {
  const current = (exercise.description ?? '').trim();
  if (exercise.i18nKey) return translatedOrFallback(translator, `${exercise.i18nKey}.description`, current || fallback);
  return current || fallback;
}

export function displayGlobalExerciseName(translator: Translator, exercise: Pick<GlobalExercise, 'i18nKey' | 'defaultName'>): string {
  return translatedOrFallback(translator, `${exercise.i18nKey}.name`, exercise.defaultName);
}

export function displayGlobalExerciseDescription(
  translator: Translator,
  exercise: Pick<GlobalExercise, 'i18nKey' | 'defaultDescription'>,
  fallback: string,
): string {
  const current = (exercise.defaultDescription ?? '').trim();
  return translatedOrFallback(translator, `${exercise.i18nKey}.description`, current || fallback);
}
