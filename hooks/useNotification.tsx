import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';
import { createContext, useContext, useState } from "react";

type severityTypes = 'success' | 'error' | 'warning' | 'info';
type useNotificationType = (message: string, severity: severityTypes) => void;

interface NotificationProviderProps {
    children: JSX.Element;
}

const NotificationContext = createContext<any>(null);

export const NotificationProvider = (props: NotificationProviderProps) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<severityTypes>('info');

    const notify = (message: string, severity: severityTypes) => {
        setMessage(message);
        setSeverity(severity);
        setOpen(true);
    };

    return <>
        <NotificationContext.Provider value={notify}>
            {props.children}
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={open}
                autoHideDuration={6000}
                onClose={() => setOpen(false)}>
                <Alert
                    onClose={() => setOpen(false)}
                    severity={severity}
                    sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    </>;
};

const useNotification = () => useContext<useNotificationType>(NotificationContext);

export default useNotification;