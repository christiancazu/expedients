
import RouterProvider from './router'
import QueryClientProvider from './query'

function App() {
  return (
    <QueryClientProvider>
      <RouterProvider />
    </QueryClientProvider>
  )
}

export default App
