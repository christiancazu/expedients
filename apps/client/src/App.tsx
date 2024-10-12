
import {
  BrowserRouter, Routes, Route 
} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomeView from './views/HomeView'
import LoginView from './views/LoginView'
import AuthRoutes, { AuthProvider } from './router'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
            </Route>
          </Route>
          <Route
            path='/login'
            element={ <LoginView /> }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
};

export default App
