import { User } from '@expedients/shared'

export default {
  set: (key: string, value: any) => localStorage.setItem(key, value),
  remove: (key: string) => localStorage.removeItem(key),
  get: (key: string) => localStorage.getItem(key) ?? null,
  setUser: (user: User) => localStorage.setItem('user', JSON.stringify(user)),
  purgeUser: () => localStorage.removeItem('user'),
  getUser: (): User | undefined => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    if (!user?.id) {
      return undefined
    }

    return user as User
  },
  clear: () => localStorage.clear()
}
