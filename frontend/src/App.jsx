import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/auth/SignUp'
import Homepage from './components/Homepage'
import LoginPage from './components/auth/LogIn'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
      </Routes>
    </div>
  )
}

export default App
