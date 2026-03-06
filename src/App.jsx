import Login from './components/Login'
import Welcome from './components/Bienvenido-test'
import Registro from './components/Registro'
import { useState } from 'react'
import './App.css'


function App() {
  const [user, setUser] = useState ([])
  return (
    <>
      {
        user.length === 0
        ? <Login setUser={setUser}></Login>
        : <Welcome user={user} setUser={setUser}></Welcome>
      }
    </>
  )
}

export default App
