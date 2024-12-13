import { Layout } from 'antd'

interface Props {
	children: React.ReactNode
}

export default function AuthLayout({ children }: Props): React.ReactNode {
	return <Layout style={{ minHeight: '100vh' }}>{children}</Layout>
}
