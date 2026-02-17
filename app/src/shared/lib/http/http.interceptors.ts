import type { AxiosInstance, AxiosError } from 'axios'
import { logger } from '@/shared/lib/logger'

/**
 * Configures global request/response interceptors.
 * Extend as needed (e.g., auth token injection, refresh logic, logging).
 */
export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      logger.error(
        `[HTTP Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.status,
      )
      return Promise.reject(error)
    },
  )
}
