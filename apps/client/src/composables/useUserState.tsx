import { useQuery } from '@tanstack/react-query'

import { User } from '@expedients/shared'
import { queryClient } from '../config/queryClient'
import persisterUtil from '../utils/persister.util'
import { setToken } from '../config/httpClient'

const useUserState = (user?: User) => {
  const setUser = (value: Partial<User> | null) => {
    queryClient.setQueryData(['user'], (prevState: User) => ({ ...prevState, ...value }))
  }

  return {
    user: useQuery<User | null>({ queryKey: ['user'], enabled: false, initialData: user }).data,
    setUser,
    setUserSession(data: { user: User; token: string }) {
      persisterUtil.setUser(data.user)
      setUser(data.user)
      setToken(data.token)
    },
    purgeUserSession() {
      queryClient.setQueryData(['user'], null)
      persisterUtil.clear()
    }
  }
}

export default useUserState
