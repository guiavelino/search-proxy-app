import type { AxiosInstance, AxiosError } from 'axios'

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      console.error(
        `[HTTP Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.status,
      )
      return Promise.reject(error)
    },
  )
}
