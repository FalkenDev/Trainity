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
