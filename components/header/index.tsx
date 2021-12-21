import Image from "next/image"
import React from "react"

const Header = ({ user, setUserData, logout }: any) => {
  const changeUsername = () => {
    const newUsername = prompt(`Enter your new username ${user.getUsername()}`)
    setUserData({
      username: newUsername,
    })
  }

  return (
    <div className="w-4/5 relative h-[200px] bg-black p-2 border-b-2 border-pink-600 shadow-xl flex flex-col justify-center items-center space-y-3">
      <Image
        src={`https://avatars.dicebear.com/api/pixel-art/${user.get(
          "username"
        )}.svg`}
        alt="avatar"
        width={100}
        height={100}
        onClick={() => logout()}
        className="cursor-pointer"
      />
      <p className="text-pink-600 font-bold">Welcome to Metaverse App</p>
      <p className="text-pink-600 font-bold text-2xl">{user.getUsername()}</p>
      <p
        onClick={changeUsername}
        className="absolute top-1 right-2 text-sm text-pink-600 cursor-pointer sm:text-xs"
      >
        change your username
      </p>
    </div>
  )
}

export default Header
