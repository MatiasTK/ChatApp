import { useEffect, useState } from 'react'
import socket from '../utils/socket'
import { RiCheckboxBlankCircleFill } from 'react-icons/ri'
import Sidebar from './Sidebar'

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
      setSelectedUser(allUsers[0])
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

  const renderMessage = (message, index) => {
    if (message.fromSelf) {
      return (
        <div className="self-end rounded bg-[#2b5278] p-2" key={index}>
          <p className="font-bold text-sm">Me</p>
          <p>{message.content}</p>
        </div>
      )
    } else {
      return (
        <div className="self-start rounded bg-[#182533] p-2" key={index}>
          <p className="font-bold text-sm">{selectedUser.username}</p>
          <p>{message.content}</p>
        </div>
      )
    }
  }

  return (
    <div>
      <Sidebar users={users} setUsers={setUsers} selectedUser={selectedUser} setSelectedUser={(e) => setSelectedUser(e)}/>
      <div className="bg-[#0e1621] ml-[25%] h-screen text-white flex flex-col">
        <div className="py-4 border-b border-l border-black h-auto bg-[#17212b]">
          <div className="flex items-center ml-12">
            {selectedUser.connected ? (
              <RiCheckboxBlankCircleFill color="green" size={'15px'} />
            ) : (
              <RiCheckboxBlankCircleFill color="red" size={'15px'} />
            )}
            <h2 className="text-xl pl-4">{selectedUser.username}</h2>
          </div>
        </div>
        <div className="flex flex-col pt-10 px-10 grow gap-5 overflow-y-auto">
          {selectedUser.messages.map((message, index) => renderMessage(message, index))}
        </div>
        <div>
          <form onSubmit={(e) => handleSentMessage(e)}>
            <div className="px-5 py-5 flex gap-2">
              <input
                placeholder="Write a message..."
                className="rounded w-11/12 p-2 placeholder:text-smplaceholder:text-[#6d7883] bg-[#242f3d] focus:outline-0 text-white"
                required
                onChange={(e) => setActualMessage(e.target.value)}
                value={actualMessage}
              ></input>
              <button type="submit" className="text-white bg-[#2b5278] rounded-sm py-2 px-4 hover:bg-[#224260] active:bg-[#1b354d] focus:ring focus:ring-[#366696]">
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
