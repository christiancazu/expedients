import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom'
import React from 'react'
import useUserState from './composables/useUserState'
// import HomeView from './views/HomeView'
import ExpedientsView from './views/ExpedientsView'
import ExpedientView from './views/ExpedientView'
import SignInView from './views/SignInView'
import NotFoundView from './views/NotFoundView'
import MainLayout from './layouts/MainLayout'

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
  () => <RouterProvider router={ router } />

export default RouterProviderComponent
