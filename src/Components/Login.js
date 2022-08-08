/* eslint-disable react/prop-types */
import { useState } from 'react'
import socket from '../utils/socket'

export default function Login (props) {
  const { setLogged } = props

  const [username, setUsername] = useState('')

  const handleChange = (e) => {
    setUsername(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.auth = { username }
    socket.connect()
    setUsername('')
    setLogged(true)
  }

  return (
    <div className="App h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <form className="flex items-center justify-center h-full w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Your username here"
          className="border-2 border-fuchsia-900 rounded p-2 outline-violet-700 placeholder:text-sm placeholder:text-center"
          required
        />
        <button type="submit" className="text-white bg-slate-700 rounded-sm py-2 px-4" disabled={username === ''}>
          Send
        </button>
      </form>
    </div>
  )
}
