import Login from './components/Login'
import Welcome from './components/User'
import Registro from './components/Registro'
import Inicio from './components/Inicio'
import { useState } from 'react'
import './styles/user.css'
import './styles/backgrounds.css'
import './styles/forms-container.css'
import './styles/titles.css'
import './styles/inputs.css'
import './styles/buttons.css'
import './styles/error-message.css'
import './styles/auth-links.css'
import './styles/inicio.css'
 
function App() {
  const [user, setUser] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })
  const [esRegistro, setEsRegistro] = useState(false)
  const [page, setPage] = useState(() => {
    return localStorage.getItem('page') || 'inicio'
  })
 
  const handleSetUser = (nuevoUsuario) => {
    if (nuevoUsuario) {
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
    } else {
      localStorage.removeItem('usuario')
      localStorage.removeItem('page')
    }
    setUser(nuevoUsuario)
  }
 
  const handleSetPage = (nuevaPagina) => {
    localStorage.setItem('page', nuevaPagina)
    setPage(nuevaPagina)
  }
 
  if (user === null) {
    return esRegistro
      ? <Registro setEsRegistro={setEsRegistro} setUser={handleSetUser} />
      : <Login setUser={handleSetUser} setEsRegistro={setEsRegistro} />
  }
 
  if (page === 'perfil') return <Welcome user={user} setUser={handleSetUser} setPage={handleSetPage} />
  return <Inicio user={user} setUser={handleSetUser} setPage={handleSetPage} />
}
 
export default App
