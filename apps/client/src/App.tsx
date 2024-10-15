
import {
  BrowserRouter, Routes, Route 
} from 'react-router-dom'
import AuthRoutes, { AuthProvider } from './router'
import { QueryClientProvider } from './composables/useQuery'

import MainLayout from './layouts/MainLayout'
import LoginView from './views/LoginView'
import HomeView from './views/HomeView'
import ExpedientsView from './views/ExpedientsView'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider>
          <Routes>
            <Route element = { <AuthRoutes /> }>
              <Route
                path="/"
                element={ <MainLayout /> }
              >
                <Route
                  index
                  element={ <HomeView /> }
                />
                <Route
                  path='/expedients'
                  element={ <ExpedientsView /> }
                />
              </Route>
            </Route>
            <Route
              path='/login'
              element={ <LoginView /> }
            />
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  )
};

export default App
