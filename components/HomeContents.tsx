import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { IUser } from '../schema/user.schema';
import Image from "next/image";
import { ImageOutlined } from '@mui/icons-material';
import * as tf from '@tensorflow/tfjs';
import { labels } from '../utils/labels';
import useLoadingIndicator from '../hooks/useLoadingIndicator';
import ClassificationResults, { OutputDetails } from './ClassificationResults';
import html2canvas from "html2canvas";
import useNotification from '../hooks/useNotification';
import useAlertDialog from '../hooks/useAlertDialog';

export default function HomeContents({ user }: { user: IUser; }) {
    const [imageDataUrl, setImageDataUrl] = React.useState('');
    const [file, setFile] = React.useState();
    const loadingIndicator = useLoadingIndicator();
    const [outputDialogIsOpen, setOutputDialogIsOpen] = React.useState(false);
    const [outputDetails, setOutputDetails] = React.useState<OutputDetails>({
        diagnosis: "",
        modelConfidence: 0,
        imageDataUrl: "",
        recommendation: "",
        description: ""
    });
    const notify = useNotification();
    const { show } = useAlertDialog();

    const handleOutputDialogClose = () => {
        setOutputDialogIsOpen(false);
    };

    const handleFileChange = (e: any) => {
        if (e.target.files.length === 0) return;

        const files = e.target.files;
        const file = files[0];
        setFile(file);
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
            alert('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
            const base64Image = reader.result;
            setImageDataUrl(base64Image as string);
        };
    };

    const classify = () => {
        if (!imageDataUrl) return;
        predict();
    };

    const predict = async () => {
        loadingIndicator.setVisibility(true);

        // ===== SKIN OR NOT SKIN CLASSIFICATION
        const img1 = document.createElement('img');
        img1.width = 256;
        img1.height = 256;
        if (!file) return;
        img1.src = URL.createObjectURL(file);
        let model = await tf.loadLayersModel('/skin_or_not_skin_model/model.json');
        let imageTensor = tf.browser.fromPixels(img1)
            .expandDims(0)
            .expandDims(-1)
            .div(255.0)
            .reshape([-1, 256, 256, 3]);
        let pred: any = model.predict(imageTensor);
        let results = await pred.data();
        let confidence = Math.max(...results);
        let index = results.findIndex((r: any) => r === confidence);

        if (index === 0) {
            show("Ooops!", "Seems like the image is not a skin");
            loadingIndicator.setVisibility(false);
            return;
        }

        // ======== MAIN MODEL CLASSIFICATION
        const img = document.createElement('img');
        img.width = 28;
        img.height = 28;
        if (!file) return;
        img.src = URL.createObjectURL(file);

        model = await tf.loadLayersModel('/main_model/model.json');
        imageTensor = tf.browser.fromPixels(img)
            .reshape([-1, 28, 28, 3]);

        pred = model.predict(imageTensor);
        results = await (pred as any).data();
        const max = Math.max(...results);

        if (max * 100 < 98.00) {
            show("Classification Result", "Not a skin cancer");
            loadingIndicator.setVisibility(false);
            return;
        }

        index = results.findIndex((r: any) => r === max);
        loadingIndicator.setVisibility(false);
        setOutputDetails({
            diagnosis: labels[index].label,
            modelConfidence: max,
            imageDataUrl,
            ...labels[index]
        });
        setOutputDialogIsOpen(true);
    };

    const download = () => {
        const element = document.getElementById("output-download");
        if (!element) return;
        html2canvas(element).then(canvas => {
            const url = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = "true";
            downloadLink.click();
        });
    };

    const saveHistory = async () => {
        loadingIndicator.setVisibility(true);
        const res = await fetch("/api/push-history", {
            method: "POST",
            body: JSON.stringify({
                image: outputDetails.imageDataUrl,
                diagnosis: outputDetails.diagnosis,
                accuracy: outputDetails.modelConfidence,
            }),
            headers: { "Content-Type": "application/json" }
        });
        const body = await res.json();
        if (res.ok) {
            notify("Saved!", "success");
            handleOutputDialogClose();
        } else notify(body.message, "error");
        loadingIndicator.setVisibility(false);
    };

    return <>
        <Grid container my={4}>
            <Grid item sm={12} md={6}>
                <Stack alignItems="center">
                    <Image
                        alt="ascade logo"
                        src="/logo.png"
                        width={350}
                        height={140} />
                    <Stack alignItems="flex-start">
                        <Typography mt={4} variant="button">
                            The following are instruction for classification:
                        </Typography>
                        <Typography mt={4} variant="body1">
                            1. The image should be clearly captured and focus on skin you want to test.
                        </Typography>
                        <Typography mt={4} variant="body1">
                            {`2. After classifying the result will show up. Save if it is the correct image of your skin. Close if it's not and it won't save to your account.`}
                        </Typography>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item sm={12} md={6}>
                <Stack
                    spacing={3}
                    alignItems="center"
                    px={4}>
                    <Avatar
                        className='k3'
                        variant="rounded"
                        sx={{ width: "100%", height: "300px" }}
                        alt="User skin image"
                        src={imageDataUrl}>
                        <ImageOutlined sx={{ fontSize: "5rem" }} />
                    </Avatar>
                    <Button
                        disabled={loadingIndicator.isVisible}
                        fullWidth
                        component="label"
                        variant='outlined'>
                        Select an image
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button
                        disabled={loadingIndicator.isVisible || !imageDataUrl}
                        onClick={classify}
                        className='c-white'
                        fullWidth
                        variant='contained'>
                        Classify
                    </Button>
                </Stack>
            </Grid>
        </Grid>

        <Dialog
            maxWidth="md"
            sx={{ width: "800px", margin: "auto" }}
            open={outputDialogIsOpen}
            aria-labelledby="output-dialog">
            <div id='output-download'>
                <DialogTitle id="output-dialog-title">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%">
                        <Typography variant="h6">
                            Classification Results
                        </Typography>
                        <Image
                            alt="ascade logo"
                            src="/logo.png"
                            width={100}
                            height={45} />
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText
                        component="div"
                        id="output-dialog-description">
                        <ClassificationResults user={user} details={outputDetails} />
                    </DialogContentText>
                </DialogContent>
            </div>
            <DialogActions>
                <Button onClick={handleOutputDialogClose}>cancel</Button>
                <Button onClick={download}>download</Button>
                <Button onClick={saveHistory}>
                    save to history
                </Button>
            </DialogActions>
        </Dialog>
    </>;
}