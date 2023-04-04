import styles from '@/styles/DesktopHeader.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';
import { GoogleButton } from '@/components/header/google-btn';
import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import Image from 'next/image';
import { AdminOnly } from '../admin-only';
import Link from 'next/link';

export const DesktopHeader = () => {
    const { data: session } = useSession();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const openProfileMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const account = session?.user ? (
        <div className={styles.accountImageCont} onClick={openProfileMenu}>
            <Image
                src={session.user.image as string}
                className={styles.accountImage}
                width={40}
                height={40}
                alt={''}
            />
        </div>
    ) : (
        <GoogleButton
            // className={styles.googleButton}
            // type="dark"
            top={9}
            right={8}
            scale={1.15}
            onClick={() => signIn('google')}
        />
    );
    return (
        <div className="desktop">
            <div className={styles.header}>
                <Link className={styles.home} href="/">Home</Link>
                <Link className={styles.button} href="/rankings">Rankings</Link>
                <AdminOnly noExtras>
                    <Link className={styles.button} href="/add_game">Add Game</Link>
                </AdminOnly>
                {account}
            </div>
            <Menu id="profile-menu" anchorEl={anchorEl} open={open} onClose={closeMenu}>
                <MenuItem>Profile</MenuItem>
                <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
            </Menu>
        </div>
    );
};
