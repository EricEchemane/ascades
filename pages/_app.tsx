import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps }: any) {
  return (
    <SessionProvider session={pageProps?.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
