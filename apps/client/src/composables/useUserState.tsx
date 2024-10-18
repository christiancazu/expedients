import { useQuery } from '@tanstack/react-query'

import { User } from 'types'
import { queryClient } from '../config/queryClient'
import persisterUtil from '../utils/persister.util'
import { setToken } from '../config/httpClient'
import { useNavigate } from 'react-router-dom'

const useUserState = (user?: User) => {
  const navigate = useNavigate()

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
      persisterUtil.purgeUser()
      persisterUtil.remove('token')
      localStorage.clear()
      queryClient.setQueryData(['user'], null)
    }
  }
}

export default useUserState
