import styles from '@/styles/DesktopHeader.module.css';
import { signIn, useSession } from 'next-auth/react';
import GoogleButton from '@/components/header/google-btn';

export default () => {
  const { data: session } = useSession();

  let account = session?.user ? (
    <div className={styles.accountImageCont}>
      <img src={session.user.image as string} className={styles.accountImage} />
    </div>
  ) : (
    <GoogleButton
      // className={styles.googleButton}
      // type="dark"
      top={9}
      right={8}
      scale={1.15}
      onClick={() => signIn("google")}
    />
  )
  return (<>
    <div className={styles.header}>
      <div className={styles.home}>Home</div>
      <div className={styles.button}>Rankings</div>
      {account}
    </div>
  </>);
}
