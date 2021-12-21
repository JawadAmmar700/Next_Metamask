import React, { useRef, useState } from "react"
import VoiceRecorder from "../voice-recorder"
import dynamic from "next/dynamic"
const Picker = dynamic(import("emoji-picker-react"), { ssr: false })
import { EmojiHappyIcon } from "@heroicons/react/outline"

const Input = ({ Moralis, user, scrollRef }: any) => {
  const messageRef = useRef<any>(null)
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)

  const sendMessage = (e: any) => {
    e.preventDefault()
    if (!messageRef.current.value) return

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

  const onEmojiClick = (event: any, emojiObject: any) => {
    const emoji = emojiObject.emoji
    messageRef.current.value += emoji
    setIsEmojiOpen(false)
  }

  return (
    <div className="min-w-[400px] h-[40px] bg-black flex px-2 rounded-full border-2 border-pink-600">
      <div className="flex items-center justify-center relative">
        <EmojiHappyIcon
          onClick={() => setIsEmojiOpen(!isEmojiOpen)}
          className="w-5 h-5 rounded cursor-pointer text-pink-600 scale-100 hover:scale-105"
        />
        {isEmojiOpen && (
          <div className="absolute bottom-11">
            <Picker
              onEmojiClick={onEmojiClick}
              pickerStyle={{ width: "250px", height: "250px" }}
            />
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex w-full">
        <input
          ref={messageRef}
          type="text"
          className="flex-grow bg-transparent text-sm px-2 outline-none text-pink-600 placeholder-gray-800"
          placeholder={`Enter a message ${user.getUsername()}...`}
        />
        <div className="flex items-center justify-center space-x-4 flex-none">
          <VoiceRecorder user={user} />
          <button
            type="submit"
            className="text-pink-600 scale-100 hover:scale-105"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default Input
