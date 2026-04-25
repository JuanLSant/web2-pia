import Login from './components/Login'
import User from './components/User'
import Registro from './components/Registro'
import Inicio from './components/Inicio'
import Zona from './components/Zona'
import Asientos from './components/Asientos'
import Wallet from './components/Wallet'
import Ayuda from './components/Ayuda'
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
import './styles/asientos.css'

function App() {
  const [user, setUser] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })
  const [esRegistro, setEsRegistro] = useState(false)
  const [page, setPage] = useState(() => {
    return localStorage.getItem('page') || 'inicio'
  })
  const [selectedMatch, setSelectedMatch] = useState(null) // 👈 nuevo estado

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

  if (page === 'perfil') return <User user={user} setUser={handleSetUser} setPage={handleSetPage} />
  if (page === 'asientos') return <Asientos user={user} setUser={handleSetUser} setPage={handleSetPage} />
  if (page === 'ayuda') return <Ayuda user={user} setUser={handleSetUser} setPage={handleSetPage} />
  if (page === 'zona') return <Zona user={user} setUser={handleSetUser} setPage={handleSetPage} selectedMatch={selectedMatch} /> // 👈
  return <Inicio user={user} setUser={handleSetUser} setPage={handleSetPage} setSelectedMatch={setSelectedMatch} /> // 👈
}

export default App
