import axios from 'axios'
import { setupInterceptors } from './http.interceptors'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

setupInterceptors(httpClient)

export { httpClient }
