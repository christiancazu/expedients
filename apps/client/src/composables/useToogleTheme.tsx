import { useQuery } from '@tanstack/react-query'
import { queryClient } from '../config/queryClient'
import persisterUtil from '../utils/persister.util'

type Theme = 'dark' | 'default'

const storedCurrentTheme: Theme = persisterUtil.get('theme') as Theme || 'default'
const rootEl = document.documentElement

if (storedCurrentTheme === 'dark') {
  rootEl.classList.add('dark')
}

export default function useToogleTheme() {
  const currentTheme = useQuery<{theme: Theme}>({
    queryKey: ['theme'],
    initialData: {
      theme: storedCurrentTheme
    },
    enabled: false
  }).data.theme

  const toggleTheme = () => {
    let isDarkTheme = false

    if (rootEl.classList.contains('dark')) {
      rootEl.classList.remove('dark')
      persisterUtil.set('theme', 'default')
    } else {
      rootEl.classList.add('dark')
      persisterUtil.set('theme', 'dark')
      isDarkTheme = true
    }

    queryClient.setQueryData(['theme'], { theme: isDarkTheme ? 'dark' : 'default' })
  }
  return { toggleTheme, currentTheme }
}
