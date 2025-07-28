/**
 * @fileoverview Netlify Blobs service for data persistence and storage operations
 * @packageDocumentation
 */

import { getStore, getDeployStore } from '@netlify/blobs'
import type { Store } from '@netlify/blobs'

/**
 * Interface dla user preferences storage
 * @interface UserPreferences
 */
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system'
    language: string
    layoutMode: 'compact' | 'comfortable'
    notifications: boolean
    lastUpdated: number
}

/**
 * Interface dla cache entry
 * @interface CacheEntry
 */
export interface CacheEntry<T = any> {
    data: T
    timestamp: number
    ttl: number
    key: string
}

/**
 * Interface dla file upload metadata
 * @interface FileMetadata
 */
export interface FileMetadata {
    filename: string
    contentType: string
    size: number
    uploadedBy: string
    uploadedAt: number
    description?: string
}

/**
 * Netlify Blobs service providing data persistence capabilities
 * 
 * This service abstracts Netlify Blobs operations and provides
 * type-safe methods for common storage patterns.
 * 
 * @example
 * ```typescript
 * const blobService = new BlobService()
 * 
 * // Save user preferences
 * await blobService.saveUserPreferences('user123', {
 *   theme: 'dark',
 *   language: 'pl',
 *   layoutMode: 'comfortable',
 *   notifications: true,
 *   lastUpdated: Date.now()
 * })
 * 
 * // Get cached API response
 * const cachedData = await blobService.getCachedData('api:users:list')
 * ```
 * 
 * @since 1.0.0
 */
export class BlobService {
    private readonly userStore: Store
    private readonly cacheStore: Store
    private readonly filesStore: Store
    private readonly deployStore: Store

    /**
     * Initialize BlobService with predefined stores
     * 
     * @constructor
     */
    constructor() {
        this.userStore = getStore('user-data')
        this.cacheStore = getStore('api-cache')
        this.filesStore = getStore('file-uploads')
        this.deployStore = getDeployStore('build-data')
    }

    /**
     * Save user preferences to persistent storage
     * 
     * @param userId - Unique user identifier
     * @param preferences - User preference object
     * @returns Promise resolving to save operation result
     * 
     * @example
     * ```typescript
     * await blobService.saveUserPreferences('user123', {
     *   theme: 'dark',
     *   language: 'pl',
     *   layoutMode: 'comfortable',
     *   notifications: true,
     *   lastUpdated: Date.now()
     * })
     * ```
     */
    async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<{ modified: boolean; etag?: string }> {
        const key = `preferences:${userId}`
        return await this.userStore.setJSON(key, preferences, {
            metadata: {
                updatedAt: Date.now(),
                version: '1.0',
                type: 'user-preferences'
            }
        })
    }

    /**
     * Retrieve user preferences from storage
     * 
     * @param userId - Unique user identifier
     * @returns Promise resolving to user preferences or null if not found
     * 
     * @example
     * ```typescript
     * const preferences = await blobService.getUserPreferences('user123')
     * if (preferences) {
     *   console.log('User theme:', preferences.theme)
     * }
     * ```
     */
    async getUserPreferences(userId: string): Promise<UserPreferences | null> {
        const key = `preferences:${userId}`
        return await this.userStore.get(key, { type: 'json' }) as UserPreferences | null
    }

    /**
     * Cache API response data with TTL
     * 
     * @param cacheKey - Unique cache identifier
     * @param data - Data to cache
     * @param ttlMinutes - Time to live in minutes (default: 60)
     * @returns Promise resolving to cache operation result
     * 
     * @example
     * ```typescript
     * await blobService.cacheApiResponse('api:users:list', usersData, 30)
     * ```
     */
    async cacheApiResponse<T>(cacheKey: string, data: T, ttlMinutes: number = 60): Promise<{ modified: boolean; etag?: string }> {
        const cacheEntry: CacheEntry<T> = {
            data,
            timestamp: Date.now(),
            ttl: ttlMinutes * 60 * 1000, // Convert to milliseconds
            key: cacheKey
        }

        return await this.cacheStore.setJSON(cacheKey, cacheEntry, {
            metadata: {
                expiresAt: Date.now() + (ttlMinutes * 60 * 1000),
                type: 'api-cache',
                ttl: ttlMinutes
            }
        })
    }

    /**
     * Retrieve cached data if still valid
     * 
     * @param cacheKey - Unique cache identifier
     * @returns Promise resolving to cached data or null if expired/not found
     * 
     * @example
     * ```typescript
     * const cachedUsers = await blobService.getCachedData<User[]>('api:users:list')
     * if (!cachedUsers) {
     *   // Cache miss - fetch fresh data
     *   const freshData = await fetchUsers()
     *   await blobService.cacheApiResponse('api:users:list', freshData)
     * }
     * ```
     */
    async getCachedData<T>(cacheKey: string): Promise<T | null> {
        const cacheEntry = await this.cacheStore.get(cacheKey, { type: 'json' }) as CacheEntry<T> | null

        if (!cacheEntry) {
            return null
        }

        // Check if cache is still valid
        const now = Date.now()
        const isExpired = (now - cacheEntry.timestamp) > cacheEntry.ttl

        if (isExpired) {
            // Optionally clean up expired cache
            await this.cacheStore.delete(cacheKey)
            return null
        }

        return cacheEntry.data
    }

    /**
     * Store file upload with metadata
     * 
     * @param fileId - Unique file identifier
     * @param fileData - File content as Blob, ArrayBuffer, or string
     * @param metadata - File metadata
     * @returns Promise resolving to upload operation result
     * 
     * @example
     * ```typescript
     * const fileId = uuid()
     * await blobService.storeFile(fileId, fileBlob, {
     *   filename: 'avatar.jpg',
     *   contentType: 'image/jpeg',
     *   size: fileBlob.size,
     *   uploadedBy: 'user123',
     *   uploadedAt: Date.now(),
     *   description: 'User profile avatar'
     * })
     * ```
     */
    async storeFile(
        fileId: string,
        fileData: Blob | ArrayBuffer | string,
        metadata: FileMetadata
    ): Promise<{ modified: boolean; etag?: string }> {
        return await this.filesStore.set(fileId, fileData, {
            metadata: {
                ...metadata,
                type: 'file-upload',
                storedAt: Date.now()
            }
        })
    }

    /**
     * Retrieve file with metadata
     * 
     * @param fileId - Unique file identifier
     * @returns Promise resolving to file data and metadata or null if not found
     * 
     * @example
     * ```typescript
     * const file = await blobService.getFile('file123')
     * if (file) {
     *   console.log('File size:', file.metadata.size)
     *   // Use file.data for file content
     * }
     * ```
     */
    async getFile(fileId: string): Promise<{ data: any; metadata: FileMetadata & { type: string; storedAt: number } } | null> {
        return await this.filesStore.getWithMetadata(fileId) as any
    }

    /**
     * List files with optional prefix filter
     * 
     * @param prefix - Optional prefix to filter files
     * @returns Promise resolving to list of file keys and metadata
     * 
     * @example
     * ```typescript
     * // List all files
     * const allFiles = await blobService.listFiles()
     * 
     * // List user-specific files
     * const userFiles = await blobService.listFiles('user123/')
     * ```
     */
    async listFiles(prefix?: string): Promise<{ blobs: Array<{ key: string; etag: string }> }> {
        return await this.filesStore.list({ prefix })
    }

    /**
     * Delete cached data
     * 
     * @param cacheKey - Cache key to delete
     * @returns Promise resolving when deletion is complete
     * 
     * @example
     * ```typescript
     * await blobService.clearCache('api:users:list')
     * ```
     */
    async clearCache(cacheKey: string): Promise<void> {
        await this.cacheStore.delete(cacheKey)
    }

    /**
     * Delete user preferences
     * 
     * @param userId - User identifier
     * @returns Promise resolving when deletion is complete
     * 
     * @example
     * ```typescript
     * await blobService.deleteUserPreferences('user123')
     * ```
     */
    async deleteUserPreferences(userId: string): Promise<void> {
        const key = `preferences:${userId}`
        await this.userStore.delete(key)
    }

    /**
     * Delete file
     * 
     * @param fileId - File identifier
     * @returns Promise resolving when deletion is complete
     * 
     * @example
     * ```typescript
     * await blobService.deleteFile('file123')
     * ```
     */
    async deleteFile(fileId: string): Promise<void> {
        await this.filesStore.delete(fileId)
    }

    /**
     * Store deploy-specific build data
     * 
     * @param key - Data key
     * @param data - Build data to store
     * @returns Promise resolving to store operation result
     * 
     * @example
     * ```typescript
     * await blobService.storeBuildData('build-stats', {
     *   buildTime: Date.now(),
     *   bundleSize: '2.5MB',
     *   dependencies: packageJson.dependencies
     * })
     * ```
     */
    async storeBuildData(key: string, data: any): Promise<{ modified: boolean; etag?: string }> {
        return await this.deployStore.setJSON(key, data, {
            metadata: {
                createdAt: Date.now(),
                type: 'build-data'
            }
        })
    }

    /**
     * Get deploy-specific build data
     * 
     * @param key - Data key
     * @returns Promise resolving to build data or null if not found
     * 
     * @example
     * ```typescript
     * const buildStats = await blobService.getBuildData('build-stats')
     * ```
     */
    async getBuildData(key: string): Promise<any> {
        return await this.deployStore.get(key, { type: 'json' })
    }
}

/**
 * Singleton instance of BlobService
 * Use this instance throughout your application for consistency
 * 
 * @example
 * ```typescript
 * import { blobService } from './services/blobService'
 * 
 * // Save user preferences
 * await blobService.saveUserPreferences(userId, preferences)
 * ```
 */
export const blobService = new BlobService()

/**
 * Utility function to generate cache keys
 * 
 * @param category - Cache category (e.g., 'api', 'user', 'config')
 * @param identifier - Unique identifier within category
 * @param subKey - Optional sub-key for nested data
 * @returns Formatted cache key
 * 
 * @example
 * ```typescript
 * const key = generateCacheKey('api', 'users', 'list') // 'api:users:list'
 * ```
 */
export function generateCacheKey(category: string, identifier: string, subKey?: string): string {
    const parts = [category, identifier]
    if (subKey) {
        parts.push(subKey)
    }
    return parts.join(':')
}

/**
 * Utility function to check if data should be cached based on response
 * 
 * @param response - API response object
 * @returns Boolean indicating if response should be cached
 * 
 * @example
 * ```typescript
 * if (shouldCache(apiResponse)) {
 *   await blobService.cacheApiResponse(cacheKey, apiResponse.data)
 * }
 * ```
 */
export function shouldCache(response: { status: number; data: any }): boolean {
    // Only cache successful responses with data
    return response.status >= 200 && response.status < 300 && response.data != null
}
