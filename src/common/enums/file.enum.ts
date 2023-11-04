/**
 * Enum representing file categories.
 */
export enum FileCategory {
  /**
   * Category for profile images.
   */
  PROFILE_IMAGE = 'PROFILE_IMAGE',

  /**
   * Category for regular images.
   */
  IMAGE = 'IMAGE',

  /**
   * Category for files with an unknown category.
   */
  UNKNOWN = 'UNKNOWN',

  /**
   * Category for audio files.
   */
  AUDIO = 'AUDIO',

  /**
   * Category for pdf files.
   */
  PDF = 'PDF',

  /**
   * Category for video files.
   */
  VIDEO = 'VIDEO',
}

/**
 * Enum-like object representing folder names based on file category.
 * @readonly
 */
export const FolderNames = Object.freeze({
  [FileCategory.PROFILE_IMAGE]: 'profile_images',
  [FileCategory.IMAGE]: 'images',
  [FileCategory.AUDIO]: 'audio',
  [FileCategory.VIDEO]: 'videos',
  [FileCategory.PDF]: 'pdfs',
  [FileCategory.UNKNOWN]: 'unknown',
});
