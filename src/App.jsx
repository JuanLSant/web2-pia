import Login from './components/Login'
import Welcome from './components/Bienvenido-test'
import Registro from './components/Registro'
import { useState } from 'react'
// import './App.css'
import './styles/user.css'
import './styles/backgrounds.css'
import './styles/forms-container.css'
import './styles/titles.css'
import './styles/inputs.css'
import './styles/buttons.css'
import './styles/error-message.css'
import './styles/auth-links.css'


function App() {
  const [user, setUser] = useState(null)
  const [esRegistro, setEsRegistro] = useState(false) 
  console.log("User actual:", user);

  return (
    <>
      {user === null
        ? esRegistro
          ? <Registro setEsRegistro={setEsRegistro} setUser={setUser} />
          : <Login setUser={setUser} setEsRegistro={setEsRegistro} />
        : <Welcome user={user} setUser={setUser} />
      }
    </>
  )
}

export default App
