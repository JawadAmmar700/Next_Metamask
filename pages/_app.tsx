import "../styles/globals.css"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      appId={`${process.env.NEXT_PUBLIC_MORALIS_ID}`}
      serverUrl={`${process.env.NEXT_PUBLIC_MORALIS_SERVER}`}
    >
      <Component {...pageProps} />
    </MoralisProvider>
  )
}

export default MyApp
