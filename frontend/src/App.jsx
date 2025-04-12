import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './components/Pages/auth/SignUp'
import Homepage from './components/Homepage'
import LoginPage from './components/Pages/auth/LogIn'
import Sidebar from './components/common/Slidebar'
import RightPanel from './components/common/RightPanel'
import NotificationPage from './components/Pages/notifications/NotificationPage'
import ProfilePage from './components/Pages/profile/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'

const App = () => {
  const { data: authUser , isLoading , isError , error} = useQuery({
    queryKey: ['authUser'],
    queryFn: async() => {
      try {
        const res = await fetch("api/auth/me" , {
          credentials: "include"
        });
        const data = await res.json();
        
        if(data.error) return null;

        if(!res.ok) {
          throw new Error(data.error || "Something went wrong ")
        }
        
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false
  })

  if(isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size="lg"/>
      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar/>}
      <Routes>
        <Route path='/' element={authUser ? <Homepage/> : <Navigate to="/login"/>}></Route>
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>}></Route>
        <Route path='/signup' element={!authUser ? <SignUp/> : <Navigate to="/" />}></Route>
        <Route path='/notifications' element={authUser ? <NotificationPage/> : <Navigate to="/login" />}></Route>
        <Route path='/profile/:username' element={authUser ? <ProfilePage/>: <Navigate to="/login"/> }></Route>
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster/>
    </div>
  )
}

export default App
