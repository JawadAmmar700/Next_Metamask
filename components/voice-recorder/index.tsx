import React, { useRef, useState } from "react"
import { useMoralis, useMoralisFile } from "react-moralis"
import { MicrophoneIcon } from "@heroicons/react/outline"

const VoiceRecorder = ({ user }: any) => {
  const { saveFile } = useMoralisFile()
  const [isRecording, setIsRecording] = useState(false)
  const voiceRef = useRef<any>(null)
  const intervalRef = useRef<any>(null)
  const streamRef = useRef<any>(null)
  const [audioChunks, setAudioChuncks] = useState<any>([])
  const { Moralis } = useMoralis()
  const [sec, setSec] = useState(0)

  const time = () => {
    intervalRef.current = setInterval(() => {
      setSec(sec => sec + 1)
    }, 1000)
  }

  const cancelTime = () => {
    setSec(0)
    intervalRef.current = clearInterval(intervalRef.current)
  }

  const record = async () => {
    setIsRecording(true)
    time()
    let chunks: any = []
    await navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream)
      voiceRef.current = mediaRecorder
      streamRef.current = stream
      mediaRecorder.start()

      mediaRecorder.addEventListener("dataavailable", event => {
        const eventData = event.data
        chunks.push(eventData)
      })
    })
    setAudioChuncks(chunks)
  }

  const stop = () => {
    setAudioChuncks([])
    cancelTime()
    setIsRecording(false)
    streamRef.current.getTracks()[0].stop()
  }

  const send = () => {
    voiceRef.current.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks, {
        type: "audio/webm",
      })

      saveFile(`${user.getUsername()}-${sec}.webm`, audioBlob, {
        type: "audio/webm",
        saveIPFS: true,
      }).then(data => {
        const messageInstance = Moralis.Object.extend("messages")
        const message = new messageInstance()
        message.save({
          message: data?._ipfs,
          user: user.getUsername(),
          ethAddress: user.get("ethAddress"),
        })
      })
      stop()
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
