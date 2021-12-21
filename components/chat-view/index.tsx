import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"
import Moment from "react-moment"
import getBlobDuration from "get-blob-duration"
import { PlayIcon, PauseIcon } from "@heroicons/react/outline"

const View = ({ message, user }: any) => {
  const audioUrl = message.attributes.message
  const isAudio = audioUrl.includes(`blob:${process.env.NEXT_PUBLIC_BASE_URL}`)
  const audioRef = useRef<any>(null)
  const [audioDuration, setAudioDuration] = useState(0)
  const [sec, setSec] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const getAudioDuration = async () => {
      const duration = await getBlobDuration(audioUrl)
      setAudioDuration(duration)
    }
    getAudioDuration()
  }, [audioUrl])

  const formatTime = (sec: number) => {
    const seconds = Math.floor(sec % 60)
    const minutes = Math.floor(sec / 60)

    const returnMinutes = minutes < 10 ? `0${minutes}` : minutes
    const returnSeconds = seconds < 10 ? `0${seconds}` : seconds

    return `${returnMinutes}:${returnSeconds}`
  }

  const timeUpdate = () => {
    const currentTime = parseInt(audioRef.current.currentTime)
    setSec(currentTime)
    if (audioRef.current.ended) {
      setIsPlaying(false)
      return
    }
    requestAnimationFrame(timeUpdate)
  }

  const playAudio = () => {
    audioRef.current.play()
    requestAnimationFrame(timeUpdate)
    setIsPlaying(true)
  }

  const pauseAudio = () => {
    setIsPlaying(false)
    audioRef.current.pause()
    cancelAnimationFrame(requestAnimationFrame(timeUpdate))
  }

  return (
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
          {!isAudio ? (
            <p>{message.attributes.message}</p>
          ) : (
            <div className="flex items-center space-x-2">
              <div>
                <audio src={audioUrl} ref={audioRef} />

                {!isPlaying ? (
                  <PlayIcon
                    onClick={playAudio}
                    className="h-6 w-6 scale-100 hover:scale-105 cursor-pointer"
                  />
                ) : (
                  <PauseIcon
                    onClick={pauseAudio}
                    className="h-6 w-6 scale-100 hover:scale-105 cursor-pointer"
                  />
                )}
              </div>

              {!isPlaying ? (
                <p className="text-xs">{formatTime(audioDuration)}</p>
              ) : (
                <p className="text-xs">{formatTime(sec)}</p>
              )}
            </div>
          )}
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
          <p className="text-xs text-gray-600">{message.attributes.user}</p>
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
  )
}

export default View
