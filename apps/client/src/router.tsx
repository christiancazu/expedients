import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import React from 'react'
import useUserState from './composables/useUserState'
import HomeView from './views/HomeView'
import ExpedientsView from './views/ExpedientsView'
import ExpedientView from './views/ExpedientView'
import LoginView from './views/LoginView'

const AuthRoutes: React.FC = () => {
  const { user } = useUserState()

  return user ? <Outlet /> : <Navigate to="/login" />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoutes />,
    children: [
      {
        index: true,
        element: <HomeView />
      },
      {
        path: '/expedients',
        element: <ExpedientsView />
      },
      {
        path: '/expedients/:id',
        element: <ExpedientView />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginView />
  }
])

const RouterProviderComponent: React.FC<{ children?: React.ReactNode }> =
  () => <RouterProvider router={ router } />

export default RouterProviderComponent
