import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
import cors from 'cors'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

app.use(cors())

// Login
io.use((socket, next) => {
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error('Invalid username'))
  }

  socket.username = username
  next()
})

io.on('connection', (socket) => {
  console.log('New user:', socket.id, socket.username)

  // Get users
  const users = []
  for (const [id, socket] of io.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
      connected: true,
      messages: [],
      hasNewMessages: false
    })
  }
  socket.emit('users', users)

  // Notify users
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
    connected: true,
    messages: [],
    hasNewMessages: false
  })

  socket.on('message', ({ content, to }) => {
    socket.to(to).emit('message', {
      content,
      from: socket.id,
      hasNewMessages: true
    })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.id)
  })
})

const PORT = process.env.PORT || 3002

httpServer.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})