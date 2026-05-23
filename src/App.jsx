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
import './styles/Login.css'

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  const [user, setUser] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuario')
      if (!guardado || guardado === 'undefined') return null
      return JSON.parse(guardado)
    } catch (e) {
      console.error("Error al parsear el usuario de localStorage:", e)
      localStorage.removeItem('usuario')
      return null
    }
  })
  const [esRegistro, setEsRegistro] = useState(false)
  const [page, setPage] = useState(() => {
    const guardadoPage = localStorage.getItem('page')
    return (guardadoPage && guardadoPage !== 'undefined') ? guardadoPage : 'inicio'
  })
  const [selectedMatch, setSelectedMatch] = useState(() => {
    try {
      const guardado = localStorage.getItem('selectedMatch')
      if (!guardado || guardado === 'undefined') return null
      return JSON.parse(guardado)
    } catch (e) {
      console.error("Error al parsear el partido de localStorage:", e)
      return null
    }
  })

  const handleSetUser = (nuevoUsuario) => {
    if (nuevoUsuario) {
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
    } else {
      localStorage.removeItem('usuario')
      localStorage.removeItem('page')
      localStorage.removeItem('selectedMatch')
    }
    setUser(nuevoUsuario)
  }

  const handleSetPage = (nuevaPagina) => {
    localStorage.setItem('page', nuevaPagina)
    setPage(nuevaPagina)
  }

  const handleSetSelectedMatch = (nuevoPartido) => {
    if (nuevoPartido) {
      localStorage.setItem('selectedMatch', JSON.stringify(nuevoPartido))
    } else {
      localStorage.removeItem('selectedMatch')
    }
    setSelectedMatch(nuevoPartido)
  }

return (
    <PayPalScriptProvider options={{ 
    "client-id": "AVstGf4j0ILHe7TUdgNuASvwoS3Fc-qjvCKJCkQcebqFVNPjMkV5a_GR8NkuYvTrsXoZglLcs_fLLnpc", 
    "currency": "MXN",  
    "environment": "sandbox"
}}>
      {user === null ? (
        esRegistro
          ? <Registro setEsRegistro={setEsRegistro} setUser={handleSetUser} />
          : <Login setUser={handleSetUser} setEsRegistro={setEsRegistro} />
      ) : (
        <>
          {page === 'perfil' && <User user={user} setUser={handleSetUser} setPage={handleSetPage} />}
          {page === 'asientos' && <Asientos user={user} setUser={handleSetUser} setPage={handleSetPage} selectedMatch={selectedMatch} />}
          {page === 'ayuda' && <Ayuda user={user} setUser={handleSetUser} setPage={handleSetPage} />}
          {page === 'zona' && <Zona user={user} setUser={handleSetUser} setPage={handleSetPage} selectedMatch={selectedMatch} />}
          {page === 'inicio' && <Inicio user={user} setUser={handleSetUser} setPage={handleSetPage} setSelectedMatch={handleSetSelectedMatch} />}
        </>
      )}
    </PayPalScriptProvider>
  )
}

export default App
