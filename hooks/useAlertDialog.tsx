import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { createContext, useContext, useState } from "react";

const AlertDialogContext = createContext<any>(null);

const useAlertDialog = () => useContext<{
    show: (title: string, message: string) => boolean;
}>(AlertDialogContext);

export default useAlertDialog;

interface ConfirmOptions {
    title: string;
    message: string;
}

export const AlertDialogProvider = (props: { children: JSX.Element; }) => {
    const [isOpen, setOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>();

    const handleClose = () => setOpen(false);

    const show = (title: string, message: string) => {
        setOptions({ title, message });
        setOpen(true);
    };

    return <AlertDialogContext.Provider value={{ show }}>
        {props.children}
        <Dialog
            open={isOpen}
            onClose={handleClose}
            scroll={"paper"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
        >
            <DialogTitle id="scroll-dialog-title"> {options?.title} </DialogTitle>
            <DialogContent>
                <DialogContentText
                    id="scroll-dialog-description"
                    tabIndex={-1}>
                    {options?.message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Ok</Button>
            </DialogActions>
        </Dialog>
    </AlertDialogContext.Provider>;
};