import React, { useRef, useState } from "react"
import { useMoralis } from "react-moralis"
import { MicrophoneIcon } from "@heroicons/react/outline"

const VoiceRecorder = ({ user }: any) => {
  const [isRecording, setIsRecording] = useState(false)
  const voiceRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const streamRef = useRef<any>(null)
  const [audioChunks, setAudioChuncks] = useState<any>([])
  const { Moralis } = useMoralis()
  const [sec, setSec] = useState(0)

  const countUp = () => {
    intervalRef.current = setInterval(() => {
      setSec(sec => sec + 1)
    }, 1000)
  }

  const record = () => {
    setIsRecording(true)
    countUp()
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream)
      voiceRef.current = mediaRecorder
      streamRef.current = stream
      mediaRecorder.start()

      mediaRecorder.addEventListener("dataavailable", event => {
        const eventData = event.data
        audioChunks.push(eventData)
        setAudioChuncks([...audioChunks, eventData])
      })
    })
  }

  const stop = () => {
    setAudioChuncks([])
    setSec(0)
    clearInterval(intervalRef.current)
    setIsRecording(false)
    streamRef.current.getTracks()[0].stop()
  }

  const send = () => {
    voiceRef.current.addEventListener("stop", () => {
      const preventDuplicate = [...new Set(audioChunks)]
      const lastAudioChuck =
        preventDuplicate.length > 1
          ? [preventDuplicate[preventDuplicate.length - 1]]
          : preventDuplicate
      const audioBlob = new Blob(lastAudioChuck, { type: "audio/mpeg-3" })
      const audioUrl = URL.createObjectURL(audioBlob)
      const messageInstance = Moralis.Object.extend("messages")
      const message = new messageInstance()
      message.save({
        message: audioUrl,
        user: user.getUsername(),
        ethAddress: user.get("ethAddress"),
      })
      setIsRecording(false)
      streamRef.current.getTracks()[0].stop()
    })
    voiceRef.current.stop()
  }

  return (
    <div className="text-pink-600 flex-none relative">
      <MicrophoneIcon
        onClick={record}
        className="w-4 h-4 text-pink-500 cursor-pointer scale-100 hover:scale-105"
      />
      {isRecording && (
        <div className="w-[120px] h-[30px] bg-black flex items-center justify-evenly  space-x-2  px-2 rounded-full border-2 border-pink-600 absolute -top-11 ">
          <div
            onClick={stop}
            className="w-2 h-2 bg-red-600 animate-pulse rounded-full"
          ></div>
          <p className="text-xs">{sec}s</p>
          <p onClick={stop} className="text-sm cursor-pointer">
            ❌
          </p>
          <p onClick={send} className="text-sm cursor-pointer">
            ✔
          </p>
        </div>
      )}
    </div>
  )
}

export default VoiceRecorder
