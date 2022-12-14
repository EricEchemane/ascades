import { Avatar, Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import React, { FormEvent, useEffect } from 'react';
import Image from "next/image";
import { Google } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useLoadingIndicator from '../hooks/useLoadingIndicator';
import { useRouter } from 'next/router';
import useNotification from '../hooks/useNotification';

export default function SignUp() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [gender, setGender] = React.useState("");
    const [birthDate, setBirthDate] = React.useState<Dayjs | null>(null);
    const loadingIndicator = useLoadingIndicator();
    const notify = useNotification();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!birthDate) {
            notify("Birth date is required", "error");
            return;
        }
        if (gender === "") {
            notify("Select your gender", "error");
            return;
        }

        loadingIndicator.setVisibility(true);
        const res = await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({
                name: session?.user?.name || "",
                email: session?.user?.email || "",
                image: session?.user?.image || "",
                birthDate: birthDate?.toString(),
                gender
            }),
            headers: { "Content-Type": "application/json" }
        });
        const body = await res.json();
        if (res.ok) router.replace("/");
        else notify(body.message, "error");
        loadingIndicator.setVisibility(false);
    };

    useEffect(() => {
        loadingIndicator.setVisibility(status === "loading");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    useEffect(() => {
        if (session && session.user) {
            fetch("/api/get-user")
                .then(res => res.json())
                .then(body => {
                    if (body.success) router.replace("/");
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    return <>
        <Head><title>Sign in</title></Head>
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
                        Sign in
                    </Typography>
                    <Button
                        onClick={() => signIn("google")}
                        style={{ color: "white" }}
                        variant="contained"
                        startIcon={<Google />}>
                        Continue with google
                    </Button>
                </Stack>
                : <form onSubmit={handleSubmit}>
                    <Stack
                        my={3}
                        spacing={3}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between">
                            <Typography
                                variant='h3'>
                                Sign in
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