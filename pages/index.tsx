import { Inter } from '@next/font/google'
import Header from '@/components/header/header'
// import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <main>
        <Header />
      </main>
    </>
  )
}