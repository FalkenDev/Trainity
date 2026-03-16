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

import { ActivityIcon } from '../../activity/activity.entity';

export const activitiesToSeed = [
  {
    name: 'Running',
    description: 'Outdoor running sessions',
    icon: ActivityIcon.RUNNING,
    trackDistance: true,
    trackPace: true,
    trackElevation: true,
    trackCalories: true,
  },
  {
    name: 'Walking',
    description: 'Walking and hiking',
    icon: ActivityIcon.WALKING,
    trackDistance: true,
    trackPace: true,
    trackElevation: true,
    trackCalories: true,
  },
  {
    name: 'Cycling',
    description: 'Road and mountain biking',
    icon: ActivityIcon.CYCLING,
    trackDistance: true,
    trackPace: false,
    trackElevation: true,
    trackCalories: true,
  },
  {
    name: 'Floorball',
    description: 'Floorball training and matches',
    icon: ActivityIcon.OTHER,
    trackDistance: false,
    trackPace: false,
    trackElevation: false,
    trackCalories: true,
  },
  {
    name: 'Football',
    description: 'Football training and matches',
    icon: ActivityIcon.FOOTBALL,
    trackDistance: false,
    trackPace: false,
    trackElevation: false,
    trackCalories: true,
  },
  {
    name: 'Swimming',
    description: 'Swimming sessions',
    icon: ActivityIcon.SWIMMING,
    trackDistance: true,
    trackPace: false,
    trackElevation: false,
    trackCalories: true,
  },
  {
    name: 'Kayaking',
    description: 'Kayaking and canoeing',
    icon: ActivityIcon.KAYAKING,
    trackDistance: true,
    trackPace: false,
    trackElevation: false,
    trackCalories: true,
  },
];
