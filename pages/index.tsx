import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useSession, getProviders, signIn, signOut } from "next-auth/react"
import DesktopHeader from '@/components/desktop-header'
import MobileHeader from '@/components/mobile-header'
// import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()

  let signInComp = session ? (
    <>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  ) : (
    <>
    {/*  Not signed in <br/>
      <button onClick={() => signIn("google")}>Sign In</button> */}
    </>
  )

  let desktop = (<div className='desktop'>
    <DesktopHeader />
    {signInComp}
  </div>)

  let mobile = (<div className='mobile'>
    <MobileHeader />
    {signInComp}
  </div>)

  return (
    <>
      <Head>
        <title>Billiards Club</title>
        <meta name="description" content="Billiards Club Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {desktop}
        {mobile}
      </main>
    </>
  )
}