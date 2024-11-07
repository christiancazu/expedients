
import RouterProvider from './router'
import QueryClientProvider from './query'
import NotifyProvider from './notify'
import ThemeProvider from './theme'

function App() {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <NotifyProvider>
          <RouterProvider />
        </NotifyProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
