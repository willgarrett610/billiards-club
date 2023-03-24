import { useSession } from 'next-auth/react';
import styles from '@/styles/AdminOnly.module.css';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface AdminOnlyProps {
    children: JSX.Element | JSX.Element[];
}

export const AdminOnly = ({ children }: AdminOnlyProps) => {
    const { data: session, status } = useSession();

    const content =
        status === 'loading' ? (
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
        ) : session?.user.admin ? (
            <>{children}</>
        ) : (
            <div className={styles.adminOnly}>You are not allowed to view this page.</div>
        );

    return content;
};
