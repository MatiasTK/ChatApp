import { io } from 'socket.io-client'

const socket = io({ autoConnect: false })
socket.onAny((socket, ...args) => {
  console.log(socket, args)
})

export default socket
