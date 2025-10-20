import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';
import * as path from 'path';
import { randomBytes } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');
  private readonly exercisesDir = path.join(this.uploadsDir, 'exercises');
  private readonly avatarsDir = path.join(this.uploadsDir, 'avatars');

  constructor() {
    this.ensureDirectoriesExist();
  }

  private async ensureDirectoriesExist() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      await fs.mkdir(this.exercisesDir, { recursive: true });
      await fs.mkdir(this.avatarsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directories:', error);
    }
  }

  /**
   * Process and optimize an exercise image
   * Optimized for mobile - smaller dimensions and size
   */
  async processExerciseImage(file: Express.Multer.File): Promise<string> {
    const filename = `${randomBytes(16).toString('hex')}.webp`;
    const filepath = path.join(this.exercisesDir, filename);

    // Optimize for mobile: max 800px width, high compression
    await sharp(file.buffer)
      .resize(800, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    return `/uploads/exercises/${filename}`;
  }

  /**
   * Process and optimize an avatar image
   * Smaller dimensions for profile pictures
   */
  async processAvatarImage(file: Express.Multer.File): Promise<string> {
    const filename = `${randomBytes(16).toString('hex')}.webp`;
    const filepath = path.join(this.avatarsDir, filename);

    // Avatar optimized: 400x400px, circular crop friendly
    await sharp(file.buffer)
      .resize(400, 400, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toFile(filepath);

    return `/uploads/avatars/${filename}`;
  }

  /**
   * Delete an image file from the filesystem
   */
  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) return;

    try {
      const filepath = path.join(process.cwd(), imageUrl);
      await fs.unlink(filepath);
    } catch (error) {
      // File might not exist, which is fine
      console.log('Image deletion failed (file may not exist):', error.message);
    }
  }

  /**
   * Validate uploaded file
   */
  validateImageFile(file: Express.Multer.File): {
    valid: boolean;
    error?: string;
  } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/jpg',
    ];

    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed',
      };
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'File too large. Maximum size is 10MB' };
    }

    return { valid: true };
  }
}
