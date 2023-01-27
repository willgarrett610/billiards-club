import styles from '@/styles/MobileHeader.module.css';
import { signIn, useSession } from 'next-auth/react';
// import GoogleButton from 'react-google-button'
import GoogleButton from '@/components/header/google-btn'
import MenuIcon from '@mui/icons-material/Menu';
import MobileNavMenu from './mobile-nav-menu';

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
      onClick={() => signIn("google")}
    />
    // <GoogleButton/>
  )
  return (<>
    <div className={styles.header}>
      <MobileNavMenu/>
      {/* <div className={styles.home}>Home</div>
      <div className={styles.button}>Mobile</div> */}
      {account}
    </div>
  </>);
}
