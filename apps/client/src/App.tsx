import NotifyProvider from './notify'
import QueryClientProvider from './query'
import RouterProvider from './router'
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
