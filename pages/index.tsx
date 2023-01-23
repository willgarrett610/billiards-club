import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"
// import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession()

  let signInComp = session ? (
    <>
      Signed in as {session.user?.name} <br/>
      <button onClick={() => signOut()}>Sign Out</button>
    </>
  ) : (
    <>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign In</button>
    </>
  )

  return (
    <>
      <Head>
        <title>Billiards Club</title>
        <meta name="description" content="Billiards Club Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {signInComp}
      </main>
    </>
  )
}
