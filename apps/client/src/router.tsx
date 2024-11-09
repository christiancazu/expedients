import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import useUserState from './composables/useUserState'
import { Spin } from 'antd'

// const HomeView = lazy(() => import('./views/HomeView'))
const ExpedientsView = lazy(() => import('./views/ExpedientsView'))
const ExpedientView = lazy(() => import('./views/ExpedientView'))
const SignInView = lazy(() => import('./views/SignInView'))
const NotFoundView = lazy(() => import('./views/NotFoundView'))
const MainLayout = lazy(() => import('./layouts/MainLayout'))
const ExpedientsCreateView = lazy(() => import('./views/ExpedientsCreateView'))

const SessionRoutes: React.FC = () => {
  const { user, purgeUserSession } = useUserState()
  const location = useLocation()

  if (!user) {
    // TODO: excluded auth routes
    if (location.pathname === '/auth/sign-in') {
      return <Navigate to={ location } />
    }

    purgeUserSession()

    return <Navigate
      replace
      to='/auth/sign-in'
    />
  }

  return <MainLayout />
}

const AuthRoutes: React.FC = () => {
  const { user } = useUserState()
  const location = useLocation()

  if (user && location.pathname === '/auth/sign-in') {
    return <Navigate
      replace
      to='/'
    />
  }

  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <SessionRoutes />,
    children: [
      {
        index: true,
        element: <Navigate
          replace
          to="/expedients"
        />
      },
      {
        path: 'expedients',
        element: <ExpedientsView />
      },
      {
        path: 'expedients/create',
        element: <ExpedientsCreateView />
      },
      {
        path: 'expedients/:id',
        element: <ExpedientView />
      }
    ]
  },
  {
    path: '/auth',
    element: <AuthRoutes />,
    children: [
      {
        path: 'sign-in',
        element: <SignInView />
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundView />
  }
])

const RouterProviderComponent: React.FC<{ children?: React.ReactNode }> =
  () => (
    <Suspense
      fallback={ <Spin
        className='d-flex justify-content-center my-20'
        size="large"
      /> }
    >
      <RouterProvider router={ router } />
    </Suspense>
  )

export default RouterProviderComponent
