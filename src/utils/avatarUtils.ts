/**
 * Student Avatar & Profile Photo Utilities
 * Supports image file upload, auto-compression to lightweight base64, and preset avatars.
 */

export interface AvatarPreset {
  id: string;
  name: string;
  category: 'student_m' | 'student_f' | 'scholar' | 'creative';
  url: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'avatar-student-1',
    name: 'Smart Student',
    category: 'student_m',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kasun&backgroundColor=b6e3f4',
  },
  {
    id: 'avatar-student-2',
    name: 'Dilani - Scholar',
    category: 'student_f',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dilani&backgroundColor=ffdfbf',
  },
  {
    id: 'avatar-student-3',
    name: 'Nimal - Academic',
    category: 'student_m',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Nimal&backgroundColor=c0aede',
  },
  {
    id: 'avatar-student-4',
    name: 'Anuki - Reader',
    category: 'student_f',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Anuki&backgroundColor=d1d4f9',
  },
  {
    id: 'avatar-student-5',
    name: 'Sunil - Scholar',
    category: 'student_m',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sunil&backgroundColor=ffd5dc',
  },
  {
    id: 'avatar-student-6',
    name: 'Kavindi - Fluent',
    category: 'student_f',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kavindi&backgroundColor=b6e3f4',
  },
  {
    id: 'avatar-student-7',
    name: 'Sahan - Explorer',
    category: 'student_m',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sahan&backgroundColor=c0aede',
  },
  {
    id: 'avatar-student-8',
    name: 'Sanduni - Graduate',
    category: 'student_f',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sanduni&backgroundColor=ffdfbf',
  },
  {
    id: 'avatar-student-9',
    name: 'Hasitha - Tech',
    category: 'student_m',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Hasitha&backgroundColor=d1d4f9',
  },
  {
    id: 'avatar-student-10',
    name: 'Poornima - Star',
    category: 'student_f',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Poornima&backgroundColor=ffd5dc',
  },
];

/**
 * Resizes and compresses an uploaded image file into a square base64 WebP/JPEG data URL (max 256x256).
 * This keeps storage usage small (~15-30KB) and avoids localStorage quota limits.
 */
export function processAvatarImage(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image.'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas 2D context not supported.'));
            return;
          }

          // Center-crop to square
          const minDim = Math.min(img.width, img.height);
          const startX = (img.width - minDim) / 2;
          const startY = (img.height - minDim) / 2;

          canvas.width = maxSize;
          canvas.height = maxSize;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(
            img,
            startX,
            startY,
            minDim,
            minDim,
            0,
            0,
            maxSize,
            maxSize
          );

          // Try WebP first, fallback to JPEG
          let dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Extract clean initials from first and last name
 */
export function getUserInitials(firstName?: string, lastName?: string): string {
  const f = (firstName || '').trim().charAt(0).toUpperCase();
  const l = (lastName || '').trim().charAt(0).toUpperCase();
  if (f && l) return `${f}${l}`;
  return f || l || 'U';
}
