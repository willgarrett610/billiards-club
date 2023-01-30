import styles from '@/styles/MobileHeader.module.css';
import { signOut, signIn, useSession } from 'next-auth/react';
// import GoogleButton from 'react-google-button'
import GoogleButton from '@/components/header/google-btn'
import MobileNavMenu from './mobile-nav-menu';
import { Menu, MenuItem } from '@mui/material';
import React from 'react';

export default () => {
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const openProfileMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const closeMenu = () => {
    setAnchorEl(null);
  }

  let account = session?.user ? (
    <div className={styles.accountImageCont} onClick={openProfileMenu}>
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
  return (<div className='mobile'>
    <div className={styles.header}>
      <MobileNavMenu/>
      {/* <div className={styles.home}>Home</div>
      <div className={styles.button}>Mobile</div> */}
      {account}
    </div>
    <Menu
      id="profile-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={closeMenu}
    >
      <MenuItem>Profile</MenuItem>
      <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
    </Menu>
  </div>);
}
