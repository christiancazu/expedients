import { useQuery } from '@tanstack/react-query'

import type { User } from '@expedients/shared'
import { setToken } from '../config/httpClient'
import { queryClient } from '../config/queryClient'
import persisterUtil from '../utils/persister.util'

const useUserState = (user?: User) => {
	const setUser = (value: Partial<User> | null) => {
		queryClient.setQueryData(['user'], (prevState: User) => ({
			...prevState,
			...value,
		}))
	}

	const isUserNotificationEnabled = useQuery({
		queryKey: ['notifications-enabled'],
		initialData: Notification.permission === 'granted',
	}).data

	const setUserNotificationEnabled = (value: boolean) => {
		queryClient.setQueryData(['notifications-enabled'], value)
	}

	return {
		user: useQuery<User | null>({
			queryKey: ['user'],
			enabled: false,
			initialData: user,
		}).data,
		setUser,
		setUserSession(data: { user: User; token: string; vapidKey: string }) {
			persisterUtil.setUser(data.user)
			persisterUtil.setVapidKey(data.vapidKey)
			setUser(data.user)
			setToken(data.token)
		},
		purgeUserSession() {
			queryClient.setQueryData(['user'], null)
			persisterUtil.purgeSession()
		},
		isUserNotificationEnabled,
		setUserNotificationEnabled,
	}
}

export default useUserState
