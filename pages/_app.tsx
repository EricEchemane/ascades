import '@fontsource/roboto/400.css';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import { LoadingIndicatorProvider } from '../hooks/useLoadingIndicator';
import { NotificationProvider } from '../hooks/useNotification';
import { ConfirmDialogProvider } from '../hooks/useConfirmDialog';
import { AlertDialogProvider } from '../hooks/useAlertDialog';

const theme = createTheme({
  palette: {
    primary: {
      main: "#a99271",
    },
    secondary: {
      main: "#a99271",
    },
  },
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={pageProps?.session}>
        <LoadingIndicatorProvider>
          <NotificationProvider>
            <ConfirmDialogProvider>
              <AlertDialogProvider>
                <Component {...pageProps} />
              </AlertDialogProvider>
            </ConfirmDialogProvider>
          </NotificationProvider>
        </LoadingIndicatorProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}

export default MyApp;
