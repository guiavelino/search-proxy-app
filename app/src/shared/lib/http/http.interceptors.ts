import type { AxiosInstance, AxiosError } from 'axios'

/**
 * Configures global request/response interceptors.
 * Extend as needed (e.g., auth token injection, refresh logic, logging).
 */
export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Centralized error handling — extend with logging, toast, etc.
      console.error(
        `[HTTP Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.status,
      )
      return Promise.reject(error)
    },
  )
}
