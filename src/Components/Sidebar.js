/* eslint-disable react/prop-types */
import { RiCheckboxBlankCircleFill } from 'react-icons/ri'
import { ImNotification } from 'react-icons/im'

export default function Sidebar({ selectedUser, setSelectedUser, setUsers, users}) {
  const renderUser = (user) => {
    return (
      <div
        className={`py-2 border-b border-black cursor-pointer relative ${
          selectedUser.userID === user.userID ? 'bg-[#2b5278]' : ''
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
          <div className="absolute right-5 top-5 ">
            {user.hasNewMessages ? <ImNotification color="#366696" size={'20px'} /> : null}
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="h-screen fixed w-[25%] z-0 top-0 left-0 bg-[#17212b] overflow-x-hidden">
      {users.map((user) => {
        return renderUser(user)
      })}
    </div>
  )
}
