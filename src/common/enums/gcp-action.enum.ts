/**
 * Enum representing various actions for Google Cloud Platform (GCP).
 * These actions can include reading, deleting, writing, and performing
 * resumable operations.
 */
export enum GcpAction {
  /**
   * Indicates a read action in GCP.
   */
  READ = 'read',

  /**
   * Indicates a delete action in GCP.
   */
  DELETE = 'delete',

  /**
   * Indicates a write action in GCP.
   */
  WRITE = 'write',

  /**
   * Indicates a resumable action in GCP.
   */
  RESUMABLE = 'resumable',
}
