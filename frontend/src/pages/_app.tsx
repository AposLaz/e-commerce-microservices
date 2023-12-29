import LayoutProvider from '@/components/Layouts/LayoutProvider'
import Loading from '@/components/Layouts/Loading';
import '@/styles/globals.css'
import theme from '@/styles/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import React from 'react';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        router.events.on('routeChangeStart', () => {
            setIsLoading(true);
        });
        router.events.on('routeChangeComplete', () => {
            setIsLoading(false);
        });
        router.events.on('routeChangeError', () => {
            setIsLoading(false);
        });
    }, [router]);

  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SessionProvider session={session}>
      <>
        { isLoading ? <Loading /> : ( 
        <LayoutProvider>
          <Component {...pageProps} />
        </LayoutProvider>
        )
        } 
     </>
    </SessionProvider>

    </ThemeProvider>
  )
}
