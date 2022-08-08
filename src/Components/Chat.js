import { useEffect, useState } from 'react'
import socket from '../utils/socket'
import { RiCheckboxBlankCircleFill, RiErrorWarningLine } from 'react-icons/ri'

export default function Chat() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState({
    userID: 0,
    username: 'Loading',
    connected: false,
    messages: [
      {
        content: '',
        fromSelf: false,
      },
    ],
    hasNewMessages: false,
  })
  const [actualMessage, setActualMessage] = useState('')

  useEffect(() => {
    socket.on('users', (allUsers) => {
      setUsers(allUsers)
    })

    socket.on('user connected', (user) => {
      setUsers((state) => [...state, user])
    })

    socket.on('user disconnected', (id) => {
      const newList = []
      users.forEach((user) => {
        if (user.userID === id) {
          user.connected = false
        }
        newList.push(user)
      })

      setUsers(newList)
    })

    socket.on('message', ({ content, from }) => {
      const newUsers = [...users]
      for (let i = 0; i < newUsers.length; i++) {
        const user = newUsers[i]
        if (user.userID === from) {
          user.messages.push({
            content,
            fromSelf: false,
          })
          user.hasNewMessages = true
        }
      }
      setUsers(newUsers)
    })

    return () => {
      socket.off('users')
      socket.off('user connected')
      socket.off('user disconnected')
      socket.off('message')
    }
  }, [users])

  const handleSentMessage = (e) => {
    e.preventDefault()
    const content = actualMessage

    socket.emit('message', {
      content,
      to: selectedUser.userID,
    })

    const newUsers = [...users]
    for (let i = 0; i < newUsers.length; i++) {
      const user = newUsers[i]
      if (user.userID === selectedUser.userID) {
        user.messages.push({
          content,
          fromSelf: true,
        })
      }
    }
    setUsers(newUsers)

    setActualMessage('')
  }

  const renderMessage = (message) => {
    if (message.fromSelf) {
      return (
        <div className="self-end" key={selectedUser.messages.length}>
          <p className="font-bold">Me:</p>
          <p>{message.content}</p>
        </div>
      )
    } else {
      return (
        <div className="self-start" key={selectedUser.messages.length}>
          <p className="font-bold">{selectedUser.username}:</p>
          <p>{message.content}</p>
        </div>
      )
    }
  }

  const renderUser = (user) => {
    if (selectedUser.userID === 0) {
      setSelectedUser(user)
    }

    return (
      <div
        className={`py-2 border-b border-slate-700 cursor-pointer relative ${
          selectedUser.userID === user.userID ? 'bg-[#1b1e23]' : ''
        }`}
        onClick={() => {
          const newUsers = [...users]
          for (let i = 0; i < newUsers.length; i++) {
            const userToChange = newUsers[i]
            if (userToChange.userID === user.userID) {
              userToChange.hasNewMessages = false
            }
          }
          setUsers(newUsers)
          setSelectedUser(user)
        }}
        key={user.userID}
      >
        <div className="flex flex-col pl-4">
          <p className="text-white text-md">{user.username}</p>
          <p className="text-sm text-slate-500">
            {user.connected ? (
              <span className="flex items-center gap-1">
                <RiCheckboxBlankCircleFill color="green" size={'10px'} />
                Online
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <RiCheckboxBlankCircleFill color="red" size={'10px'} />
                Offline
              </span>
            )}
          </p>
          <div className="absolute right-5 top-5">
            {user.hasNewMessages ? <RiErrorWarningLine color="red" size={'20px'} /> : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="h-screen fixed w-64 z-0 top-0 left-0 bg-[#23272e] overflow-x-hidden">
        {users.map((user) => {
          return renderUser(user)
        })}
      </div>
      <div className="bg-[#1e2227] ml-64 h-screen text-white flex flex-col">
        <div className="py-6 border-b border-slate-600 h-auto">
          <div className="flex items-center ml-12">
            {selectedUser.connected ? (
              <RiCheckboxBlankCircleFill color="green" size={'15px'} />
            ) : (
              <RiCheckboxBlankCircleFill color="red" size={'15px'} />
            )}
            <h2 className="text-xl pl-4">{selectedUser.username}</h2>
          </div>
        </div>
        <div className="flex flex-col pt-10 px-10 grow">
          {selectedUser.messages.map((message) => renderMessage(message))}
        </div>
        <div>
          <form onSubmit={(e) => handleSentMessage(e)}>
            <div className="px-10 py-5 flex gap-2">
              <input
                placeholder="Your message here"
                className="rounded w-11/12 p-2 placeholder:text-sm placeholder:text-center text-black"
                required
                onChange={(e) => setActualMessage(e.target.value)}
                value={actualMessage}
              ></input>
              <button type="submit" className="text-white bg-blue-700 rounded-sm py-2 px-4">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
