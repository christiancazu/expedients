import { useQuery } from '@tanstack/react-query'

import { User } from 'types'
import { queryClient } from '../config/queryClient'

const useUserState = () => ({
  user: useQuery<User | null>({ queryKey: ['user'], enabled: false, initialData: null }).data,
  setUser(value: Partial<User>) {
    queryClient.setQueryData(['user'], (prevState: User) => ({ ...prevState, ...value }))
  }
})

export default useUserState
