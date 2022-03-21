import React, { useRef } from "react"
import { useMoralis, ByMoralis, useMoralisQuery } from "react-moralis"
import View from "../chat-view"
import Input from "../input"
import { Puff } from "react-loader-spinner"
import Header from "../header"

const Chat = () => {
  const { user, setUserData, Moralis, logout }: any = useMoralis()
  const scrollRef: React.MutableRefObject<null> = useRef(null)
  const { data, error, isLoading } = useMoralisQuery(
    "messages",
    query => query.ascending("createdAt"),
    [],
    {
      live: true,
    }
  )

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#070207] to-[#4D2053] flex flex-col space-y-5 items-center">
      <Header user={user} setUserData={setUserData} logout={logout} />

      <div>
        <ByMoralis variant="dark" style={{ height: "40px" }} />
      </div>

      {!error ? (
        <div className="w-4/5 h-[270px] overflow-hidden overflow-y-scroll relative">
          {!isLoading && data ? (
            <>
              {data.map((message: any, id: number) => (
                <View message={message} user={user} key={id} />
              ))}
            </>
          ) : (
            <div className="flex items-center justify-center">
              <Puff color="#c43b6f" height={50} width={50} />
            </div>
          )}

          <p
            ref={scrollRef}
            className="flex justify-center font-medium text-white opacity-80 mt-24"
          >
            You're up to date {user.getUsername()}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-sm text-red-500 ">Sorry somrthing went wrong</p>
        </div>
      )}

      <Input Moralis={Moralis} user={user} scrollRef={scrollRef} />
    </div>
  )
}

export default Chat
