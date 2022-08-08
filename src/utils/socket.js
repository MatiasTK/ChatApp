import { io } from 'socket.io-client'

const socket = io('http://localhost:3002', { autoConnect: false })
socket.onAny((socket, ...args) => {
  console.log(socket, args)
})

export default socket
