import Login from './components/Login'
import Welcome from './components/Bienvenido-test'
import Registro from './components/Registro'
import SeleccionAsientos from './components/asientos'
import { useState } from 'react'
import './App.css'
import './styles/backgrounds.css'
import './styles/forms-container.css'
import './styles/titles.css'
import './styles/inputs.css'
import './styles/buttons.css'
import './styles/error-message.css'
import './styles/auth-links.css'


function App() {
  const [user, setUser] = useState([])
  const [esRegistro, setEsRegistro] = useState(false)

  return (
    <>
      {user.length === 0
        ? esRegistro
          ? <Registro setEsRegistro={setEsRegistro} setUser={setUser} />
          : <Login setUser={setUser} setEsRegistro={setEsRegistro} />
        : <Welcome user={user} setUser={setUser} />
      }
    </>
  )
}

export default App
