
import RouterProvider from './router'
import QueryClientProvider from './query'
import NotifyProvider from './notify'
import ThemeProvider from './theme'
import NotificationModal from './components/NotificationModal'

function App() {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <NotificationModal />
        <NotifyProvider>
          <RouterProvider />
        </NotifyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
