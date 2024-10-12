
import {
  BrowserRouter, Routes, Route 
} from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomeView from './views/HomeView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"
          element={ <MainLayout /> }
        >
          <Route index
            element={ <HomeView /> }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
};

export default App
