
import RouterProvider from './router'
import QueryClientProvider from './query'
import NotifyProvider from './notify'

function App() {
  return (
    <QueryClientProvider>
      <NotifyProvider>
        <RouterProvider />
      </NotifyProvider>
    </QueryClientProvider>
  )
}

export default App
