import Head from 'next/head';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const queryClient = new QueryClient();

export default function App({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) {
    return (
        <>
            <SessionProvider session={session}>
                <CssBaseline>
                    <ThemeProvider theme={darkTheme}>
                        <QueryClientProvider client={queryClient}>
                            <CssBaseline />
                            <Head>
                                <title>Billiards Club</title>
                                <meta name="description" content="Billiards Club Website" />
                                <meta name="viewport" content="width=device-width, initial-scale=1" />
                                <link rel="icon" href="/favicon.ico" />
                            </Head>
                            <Component {...pageProps} />
                        </QueryClientProvider>
                    </ThemeProvider>
                </CssBaseline>
            </SessionProvider>
            <Analytics/>
        </>
    );
}
