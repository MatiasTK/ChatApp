import { useEffect, useState } from 'react'
import Chat from './Components/Chat'
import Login from './Components/Login'
import socket from './utils/socket'

function App () {
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    socket.on('connect_error', (err) => {
      console.log(err)
    })

    return () => {
      socket.off('connect_error')
    }
  }, [])

  return <div>{logged ? <Chat/> : <Login setLogged={setLogged}/>}</div>
}

export default App
