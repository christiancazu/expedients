import {
  QueryClient,
  QueryClientProvider as QCProvider
} from '@tanstack/react-query'
import { axiosInstance } from '../config/axios'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false
    }
  }
}
)

export const QueryClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  <QCProvider client={ queryClient }>
    {children}
  </QCProvider>


export function getExpedients(params: any = {}) {
  return axiosInstance.get('/expedients', { params }).then(res => res.data)
}

export function getUsers() {
  return axiosInstance.get('/users').then(res => res.data)
}