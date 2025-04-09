import React from 'react'
import { Route, Routes } from 'react-router-dom'
import SignUp from './components/Pages/auth/SignUp'
import Homepage from './components/Homepage'
import LoginPage from './components/Pages/auth/LogIn'
import Sidebar from './components/common/Slidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './components/Pages/notifications/NotificationPage'
import ProfilePage from './components/Pages/profile/ProfilePage'

const App = () => {
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
      <Routes>
        <Route path='/' element={<Homepage/>}></Route>
        <Route path='/signup' element={<SignUp/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/notifications' element={<NotificationPage/>}></Route>
        <Route path='/profile/:username' element={<ProfilePage/>}></Route>
      </Routes>
      <RightPanel/>
    </div>
  )
}

export default App
