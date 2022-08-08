import http from 'http'
import { Server } from 'socket.io'
import express from 'express'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})

const __dirname = dirname(fileURLToPath(import.meta.url))

// Login
io.use((socket, next) => {
  const username = socket.handshake.auth.username
  if (!username) {
    return next(new Error('Invalid username'))
  }

  socket.username = username
  next()
})

app.use(express.urlencoded({ extended: false }))

io.on('connection', (socket) => {
  console.log('New user:', socket.id, socket.username)

  // Get users
  const users = []
  for (const [id, socket] of io.of('/').sockets) { // Looping over connected socket intances indexed by id
    users.push({
      userID: id,
      username: socket.username,
      connected: true,
      messages: [],
      hasNewMessages: false
    })
  }
  socket.emit('users', users)

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

app.use(express.static(join(__dirname, '../build')))

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
