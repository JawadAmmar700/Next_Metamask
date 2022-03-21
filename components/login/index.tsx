import React from "react"
import Image from "next/image"
import { useMoralis } from "react-moralis"

const Login = () => {
  const { authenticate } = useMoralis()
  return (
    <div className="w-full h-screen relative flex justify-center items-center">
      <Image
        src="https://links.papareact.com/55n"
        alt="backgroundImage"
        layout="fill"
        objectFit="cover"
      />
      <div className="z-50 flex flex-col space-y-10 items-center mb-72">
        <Image src="/metamask.png" alt="metamask" width={100} height={100} />
        <button
          onClick={() => authenticate()}
          className="w-[250px] h-[40px] bg-amber-500 rounded text-white font-medium animate-pulse"
        >
          Login with Metamask
        </button>
      </div>
    </div>
  )
}

export default Login
