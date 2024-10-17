
import {
  BrowserRouter, Routes, Route 
} from 'react-router-dom'
import AuthRoutes, { AuthProvider } from './router'
import { QueryClientProvider } from './composables/useQuery'

import MainLayout from './layouts/MainLayout'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'
import ExpedientsView from './views/ExpedientsView'
import ExpedientView from './views/ExpedientView'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider>
          <Routes>
            <Route element = { <AuthRoutes /> }>
              <Route
                element={ <MainLayout /> }
                path="/"
              >
                <Route
                  index
                  element={ <HomeView /> }
                />
                <Route
                  element={ <ExpedientsView /> }
                  path='/expedients'
                />
                <Route
                  element={ <ExpedientView /> }
                  path='/expedients/:id'
                />
              </Route>
            </Route>
            <Route
              element={ <LoginView /> }
              path='/login'
            />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
