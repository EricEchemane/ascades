import { Avatar, Typography } from '@mui/material';
import Head from 'next/head';
import React from 'react';
import { IUser } from '../schema/user.schema';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

type Props = {
    user: IUser;
};

export default function TestsHistory({ user: currentUser }: Props) {
    const [user, setUser] = React.useState(currentUser);
    React.useEffect(() => {
        fetch("/api/get-user")
            .then(res => res.json())
            .then(data => setUser(data.data));
    }, []);
    return <>
        <Head><title>Your Tests History</title></Head>
        <Typography variant="h5" my={4}>
            Your Tests History
        </Typography>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell> Date Taken </TableCell>
                        <TableCell> Diagnosis </TableCell>
                        <TableCell> Accuracy(%) </TableCell>
                        <TableCell> Image </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user.testsHistory.map((h, i) => (
                        <TableRow
                            key={i}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell>
                                {dayjs(h.date).format("MMMM DD, YYYY | hh:mm a")}
                            </TableCell>
                            <TableCell>
                                {h.diagnosis}
                            </TableCell>
                            <TableCell>
                                {h.accuracy * 100}%
                            </TableCell>
                            <TableCell>
                                <Avatar
                                    variant='rounded'
                                    sx={{ width: 40, height: 40 }}
                                    alt={user.name + "'s taken skin image"}
                                    src={h.image} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}