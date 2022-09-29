import { Avatar, Divider, Stack, Typography } from '@mui/material';
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
            <Stack alignItems="center" width="100%">
                <Image
                    alt="ascade logo"
                    src="/logo.png"
                    width={150}
                    height={70} />
            </Stack>
            <Typography variant='button' fontWeight={"bolder"}>
                Personal Information
            </Typography>
            <Stack
                spacing={2}
                direction="row">
                <Avatar
                    sx={{ width: 100, height: 100 }}
                    alt={user.name}
                    src={user.image} />
                <Stack spacing={.5}>
                    <Typography> Name: {user.name} </Typography>
                    <Divider />
                    <Typography> Email: {user.email} </Typography>
                    <Divider />
                    <Typography> Brithday: {dayjs(user.birthDate).format("MMMM DD, YYYY")} </Typography>
                    <Divider />
                    <Typography> Sex: {user.gender} </Typography>
                </Stack>
            </Stack>
            <Typography variant='button' fontWeight={"bolder"}>
                Analysis
            </Typography>
            <Stack
                spacing={2}
                direction="row">
                <Avatar
                    variant='rounded'
                    sx={{ width: 100, height: 100 }}
                    alt={details.diagnosis}
                    src={details.imageDataUrl} />
                <Stack spacing={.5}>
                    <Typography> Diagnosis: {details.diagnosis} </Typography>
                    <Divider />
                    <Typography> Accuracy: {details.modelConfidence * 100}% </Typography>
                    <Divider />
                    <Typography> Description: </Typography>
                    <Divider />
                    <Typography> {details.description} </Typography>
                    <Divider />
                </Stack>
            </Stack>
            <Typography variant='button' fontWeight={"bolder"}>
                Recommendation
            </Typography>
            <Typography>
                The recommendation of an Expert (Dermatologist) is to see the nearest doctor to receive the proper cancer treatment or medication. In addition, users who do not prefer undergoing any operation look for a DermaTech. DermaTech is an expert when it comes to treating and healing a skin with the use of herbal cream remedies.
            </Typography>
        </Stack>
    );
}