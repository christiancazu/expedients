import { QueryClient } from '@tanstack/react-query'
import persisterUtil from '../utils/persister.util'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false
    }
  }
})

// by default set user from localStorage persistance
queryClient.setQueryData(['user'], persisterUtil.getUser())
