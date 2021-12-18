import React, { useRef } from "react"
import { useMoralis, ByMoralis, useMoralisQuery } from "react-moralis"
import Image from "next/image"
import Moment from "react-moment"

const Chat = () => {
  const { user, setUserData, Moralis, logout }: any = useMoralis()
  const messageRef: React.MutableRefObject<null> = useRef(null)
  const scrollRef: React.MutableRefObject<null> = useRef(null)
  const { data, error, isLoading } = useMoralisQuery(
    "messages",
    query => query.ascending("createdAt"),
    [],
    {
      live: true,
    }
  )

  const changeUsername = () => {
    const newUsername = prompt(`Enter your new username ${user.getUsername()}`)
    setUserData({
      username: newUsername,
    })
  }
  console.log(data)
  const sendMessage = e => {
    e.preventDefault()
    const messageInstance = Moralis.Object.extend("messages")
    const message = new messageInstance()
    message.save({
      message: messageRef.current.value,
      user: user.getUsername(),
      ethAddress: user.get("ethAddress"),
    })

    messageRef.current.value = ""
    scrollRef.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#070207] to-[#4D2053] flex flex-col space-y-5 items-center">
      <div className="w-4/5 relative  h-[200px] bg-black p-2  border-b-2 border-pink-600 shadow-xl flex flex-col justify-center items-center space-y-3">
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
          className="absolute top-1 right-2 text-sm text-pink-600 cursor-pointer"
        >
          change your username
        </p>
      </div>

      <div>
        <ByMoralis variant="dark" style={{ height: "40px" }} />
      </div>

      {/* chat component */}
      <div className="w-4/5 h-[270px] overflow-hidden overflow-y-scroll relative">
        {!isLoading && data ? (
          <>
            {data.map((message: any) => (
              <div
                key={message.attributes.ethAddress}
                className={`text-white flex  ${
                  user.get("ethAddress") === message.attributes.ethAddress
                    ? "justify-end"
                    : "justify-start"
                }  mt-8`}
              >
                <div className="flex items-end">
                  <div
                    className={` rounded-lg p-2 ${
                      user.get("ethAddress") === message.attributes.ethAddress
                        ? "rounded-br-none bg-pink-600"
                        : "rounded-bl-none bg-blue-600"
                    }`}
                  >
                    {message.attributes.message}
                  </div>
                  <div
                    className={`rounded-full flex flex-col relative top-4 ${
                      user.get("ethAddress") === message.attributes.ethAddress
                        ? "order-last items-start"
                        : "order-first items-end"
                    }  `}
                  >
                    <Image
                      src={`https://avatars.dicebear.com/api/pixel-art/${message.attributes.user}.svg`}
                      alt="avatar"
                      width={20}
                      height={20}
                    />
                    <p className="text-xs text-gray-600">
                      {message.attributes.user}
                    </p>
                  </div>
                  <div
                    className={`text-xs text-gray-600 ${
                      user.get("ethAddress") === message.attributes.ethAddress
                        ? "order-first mr-2"
                        : "order-last ml-2"
                    } `}
                  >
                    <Moment fromNow>{message.createdAt}</Moment>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div>loading...</div>
        )}
        <p
          ref={scrollRef}
          className="flex justify-center font-medium text-white opacity-80 mt-24"
        >
          You're up to date {user.getUsername()}
        </p>
      </div>

      {/* InputFeild */}
      <form
        className="min-w-[400px] h-[40px] bg-black flex px-2 rounded-full border-2 border-pink-600"
        onSubmit={sendMessage}
      >
        <input
          ref={messageRef}
          type="text"
          className="flex-grow bg-transparent text-sm px-2 outline-none text-pink-600 placeholder-gray-800"
          placeholder={`Enter a message ${user.getUsername()}...`}
        />
        <button type="submit" className="text-pink-600 flex-none">
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat
