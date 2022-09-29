import { Avatar, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography, useTheme } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { FormEvent } from 'react';
import Image from "next/image";
import { Google } from '@mui/icons-material';
import { DatePicker, LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useLoadingIndicator from '../hooks/useLoadingIndicator';

type Props = {};

export default function SignUp({ }: Props) {
    const { data: session, status } = useSession();
    const [gender, setGender] = React.useState("male");
    const [birthDate, setBirthDate] = React.useState<Dayjs | null>(dayjs());
    const loadingIndicator = useLoadingIndicator();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(e);
    };

    return <>
        <Head><title>Sign up</title></Head>
        <Container maxWidth="sm">
            {!session || !session.user
                ? <Stack
                    my={8}
                    spacing={3}
                    alignItems="center">
                    <Image
                        alt="ascade logo"
                        src="/logo.png"
                        width={150}
                        height={70} />
                    <Typography variant="h3">
                        Sign up
                    </Typography>
                    <Button
                        onClick={() => signIn("google")}
                        style={{ color: "white" }}
                        variant="contained"
                        startIcon={<Google />}>
                        Continue with google
                    </Button>
                </Stack>
                : <form onSubmit={handleSubmit}><Stack
                    my={3}
                    spacing={3}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between">
                        <Typography
                            variant='h3'>
                            Sign up
                        </Typography>
                        <Avatar
                            sx={{
                                width: 70,
                                height: 70,
                                border: `4px solid #a99271`
                            }}
                            alt={session.user.name || ""}
                            src={session.user.image || ""} />
                    </Stack>
                    <TextField
                        defaultValue={session.user.name}
                        inputProps={{ readOnly: true }} />
                    <TextField
                        defaultValue={session.user.email}
                        inputProps={{ readOnly: true }} />
                    <Stack
                        spacing={4}
                        alignItems="center"
                        direction="row">
                        <LocalizationProvider
                            dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Birth Date"
                                value={birthDate}
                                onChange={(newValue) => {
                                    setBirthDate(newValue);
                                }}
                                renderInput={(params) => <TextField fullWidth {...params} />}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth>
                            <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={gender} row
                                onChange={e => setGender(e.target.value)}
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                            </RadioGroup>
                        </FormControl>
                    </Stack>

                    <Button
                        disabled={loadingIndicator.isVisible}
                        type="submit"
                        style={{ color: "white" }}
                        variant='contained'
                        size="large"> Save </Button>
                </Stack>
                </form>}
        </Container>
    </>;
}