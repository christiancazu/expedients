import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './config/queryClient'

const QueryClientComponent: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

export default QueryClientComponent
