import styles from '@/styles/DesktopHeader.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';
import GoogleButton from '@/components/header/google-btn';
import React from 'react';
import { Menu, MenuItem } from '@mui/material';

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
      top={9}
      right={8}
      scale={1.15}
      onClick={() => signIn("google")}
    />
  )
  return (<div className='desktop'>
    <div className={styles.header}>
      <div className={styles.home}>Home</div>
      <div className={styles.button}>Rankings</div>
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
