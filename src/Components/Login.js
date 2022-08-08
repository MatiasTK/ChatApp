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
    <div className="App h-screen bg-[#17212b]">
      <form className="flex items-center justify-center h-full w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleChange}
          placeholder="Your username here..."
          className="p-2 rounded-sm bg-[#242f3d] placeholder:text-sm placeholder:text-[#6d7883] text-white focus:outline-none"
          required
        />
        <button type="submit" className="text-white bg-[#2b5278] rounded-sm py-2 px-4 hover:bg-[#224260] active:bg-[#1b354d] focus:ring focus:ring-[#366696]" disabled={username === ''}>
          Login
        </button>
      </form>
    </div>
  )
}
