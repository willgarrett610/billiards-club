import { useSession } from 'next-auth/react';
import styles from '@/styles/AdminOnly.module.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface AdminOnlyProps {
    children: JSX.Element | JSX.Element[];
    noExtras?: boolean;
}

export const AdminOnly = ({ children, noExtras }: AdminOnlyProps) => {
    const { data: session, status } = useSession();

    const content =
        status === 'loading' ? (
            noExtras ? <></> :
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '500px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        ) : session?.user.admin || process.env.NODE_ENV === "development" ? (
            <>{children}</>
        ) : (
            noExtras ? <></> :
            <div className={styles.adminOnly}>You are not allowed to view this page.</div>
        );

    return content;
};
