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

/**
 * Helper function to construct full image URLs from relative paths
 * Handles the /v1 prefix issue with static assets
 */
export const getImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8393/v1';
  // Remove /v1 from API URL for static assets
  const baseUrl = apiUrl.replace('/v1', '');
  return `${baseUrl}${imagePath}`;
};
