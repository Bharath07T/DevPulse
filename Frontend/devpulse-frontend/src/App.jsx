import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Navbar from './components/Navbar.jsx';
import ReviewDetail from './pages/ReviewDetail.jsx';
import NewReview from './pages/NewReview.jsx';
import ReviewRoom from './pages/ReviewRoom.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path ='/' element = { <Navigate to = "/register"/> } />
          <Route path ='/register' element = {<RegisterPage/>} />
          <Route path ='/login' element = {<LoginPage/>} />

          <Route path='/dashboard' element = {
            <PrivateRoute>
              <Dashboard/>
            </PrivateRoute>
          }/>

          <Route path = '/submit' element = {
            <PrivateRoute>
              <NewReview/>
            </PrivateRoute>
          }/>

          <Route path='/review/:id' element = {<ReviewDetail/>}/>
          <Route path='/room/:id' element = { <ReviewRoom/> }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
