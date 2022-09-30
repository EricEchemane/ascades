import { Avatar, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import { IUser } from '../schema/user.schema';
import Image from "next/image";
import dayjs from 'dayjs';

export interface OutputDetails {
    imageDataUrl: string;
    diagnosis: string;
    modelConfidence: number;
    recommendation: string;
    description: string;
}
interface Props {
    user: IUser;
    details: OutputDetails;
};

export default function ClassificationResults({ user, details }: Props) {
    return (
        <Stack spacing={2}>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant='button' fontWeight={"bolder"}>
                        Personal Information
                    </Typography>
                    <Stack
                        my={2}
                        spacing={2}
                        direction="row">
                        {/* <Avatar
                            sx={{ width: 100, height: 100 }}
                            alt={user.name}
                            src={user.image} /> */}
                        <Stack spacing={.5}>
                            <Typography> <b>Name:</b> {user.name} </Typography>
                            <Divider />
                            <Typography> <b>Email:</b> {user.email} </Typography>
                            <Divider />
                            <Typography> <b>Brithday:</b> {dayjs(user.birthDate).format("MMMM DD, YYYY")} </Typography>
                            <Divider />
                            <Typography> <b>Sex:</b> {user.gender} </Typography>
                        </Stack>
                    </Stack>
                    <Avatar
                        variant='rounded'
                        sx={{ width: 250, height: 250 }}
                        alt={details.diagnosis}
                        src={details.imageDataUrl} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant='button' fontWeight={"bolder"}>
                        Analysis
                    </Typography>
                    <Stack
                        my={2}
                        spacing={2}
                        direction="row">
                        <Stack spacing={.5}>
                            <Typography> <b>Diagnosis:</b> {details.diagnosis} </Typography>
                            <Typography> <b>Accuracy:</b> {details.modelConfidence * 100}% </Typography>
                            <Typography> <b>Description:</b> </Typography>
                            <Typography> {details.description} </Typography>
                        </Stack>
                    </Stack>
                    <Typography variant='button' fontWeight={"bolder"} mt={2}>
                        Recommendation
                    </Typography>
                    <Typography>
                        The recommendation of an Expert (Dermatologist) is to see the nearest doctor to receive the proper cancer treatment or medication. In addition, users who do not prefer undergoing any operation look for a DermaTech. DermaTech is an expert when it comes to treating and healing a skin with the use of herbal cream remedies.
                    </Typography>
                </Grid>
            </Grid>
        </Stack>
    );
}