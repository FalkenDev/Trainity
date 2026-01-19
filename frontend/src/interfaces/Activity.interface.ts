export enum ActivityIcon {
  RUNNING = 'running',
  WALKING = 'walking',
  CYCLING = 'cycling',
  FOOTBALL = 'football',
  SWIMMING = 'swimming',
  KAYAKING = 'kayaking',
  HIKING = 'hiking',
  YOGA = 'yoga',
  BOXING = 'boxing',
  TENNIS = 'tennis',
  BASKETBALL = 'basketball',
  VOLLEYBALL = 'volleyball',
  SKIING = 'skiing',
  SKATING = 'skating',
  ROWING = 'rowing',
  OTHER = 'other',
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  icon: ActivityIcon;
  trackDistance: boolean;
  trackPace: boolean;
  trackElevation: boolean;
  trackCalories: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityDto {
  name: string;
  description?: string;
  icon: ActivityIcon;
  trackDistance: boolean;
  trackPace: boolean;
  trackElevation: boolean;
  trackCalories: boolean;
}

export interface ActivityLog {
  id: number;
  activity: Activity;
  date: string;
  duration: number; // in minutes
  distance?: number; // in kilometers
  pace?: string; // formatted as "5:30/km"
  elevationGain?: number; // in meters
  maxElevation?: number; // in meters
  calories?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateActivityLogDto {
  activityId: number;
  date: string; // YYYY-MM-DD format
  duration: number;
  distance?: number;
  elevationGain?: number;
  maxElevation?: number;
  calories?: number;
  notes?: string;
}
