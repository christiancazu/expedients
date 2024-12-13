import { Spin } from 'antd'
import { Suspense, lazy, useMemo } from 'react'
import {
	Navigate,
	Outlet,
	RouterProvider,
	createBrowserRouter,
	useLocation,
	useSearchParams,
} from 'react-router-dom'

import useUserState from './hooks/useUserState'

const VerifyAccount = lazy(() => import('./views/VerifyAccount'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))

// const HomeView = lazy(() => import('./views/HomeView'))
const ExpedientsView = lazy(() => import('./views/ExpedientsView'))
const ExpedientView = lazy(() => import('./views/ExpedientView'))
const SignInView = lazy(() => import('./views/SignInView'))
const NotFoundView = lazy(() => import('./views/NotFoundView'))
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const ExpedientsCreateView = lazy(() => import('./views/ExpedientCreateView'))
const ExpedientsIdEditView = lazy(
	() => import('./modules/expedients/id/ExpedientsIdEditView'),
)

const SessionRoutes: React.FC = () => {
	const { user } = useUserState()
	const location = useLocation()
	const [params, setParams] = useSearchParams()

	if (!user) {
		if (location.pathname === '/auth/sign-in') {
			return <Navigate to={location} />
		}

		let redirect = ''

		const isFromLogout = params.get('logout')

		if (isFromLogout === 'true') {
			setParams((prev) => {
				prev.delete('logout')
				return prev
			})
			window.location.replace('/auth/sign-in')
		} else {
			redirect = `?redirect=${location.pathname}`
		}

		return <Navigate replace to={`/auth/sign-in${redirect}`} />
	}

	return <MainLayout />
}

const AuthRoutes: React.FC = () => {
	const { user } = useUserState()
	const location = useLocation()

	const isValidRoute = useMemo(
		() =>
			['/auth/sign-in', '/auth/verify-account'].some((r) =>
				location.pathname.includes(r),
			),
		[location],
	)

	if (user && isValidRoute) {
		return <Navigate replace to="/" />
	}

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	)
}

const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <SessionRoutes />,
			children: [
				{
					index: true,
					element: <Navigate replace to="/expedients" />,
				},
				{
					path: 'expedients',
					handle: 'Expedientes',
					element: <ExpedientsView />,
				},
				{
					path: 'expedients/create',
					handle: 'Crear expediente',
					element: <ExpedientsCreateView />,
				},
				{
					path: 'expedients/:id/edit',
					handle: 'Editar expediente',
					element: <ExpedientsIdEditView />,
				},
				{
					path: 'expedients/:id',
					handle: 'Detalle de expediente',
					element: <ExpedientView />,
				},
			],
		},
		{
			path: '/auth',
			element: <AuthRoutes />,
			children: [
				{
					index: true,
					element: <Navigate replace to="/auth/sign-in" />,
				},
				{
					path: 'sign-in',
					element: <SignInView />,
				},
				{
					path: 'verify-account',
					element: <VerifyAccount />,
				},
			],
		},
		{
			path: '*',
			element: <NotFoundView />,
		},
	],
	{
		future: {
			v7_fetcherPersist: true,
			v7_normalizeFormMethod: true,
			v7_partialHydration: true,
			v7_relativeSplatPath: true,
			v7_skipActionErrorRevalidation: true,
		},
	},
)

const RouterProviderComponent: React.FC<{
	children?: React.ReactNode
}> = () => (
	<Suspense
		fallback={
			<Spin className="d-flex justify-content-center my-20" size="large" />
		}
	>
		<RouterProvider router={router} />
	</Suspense>
)

export default RouterProviderComponent
