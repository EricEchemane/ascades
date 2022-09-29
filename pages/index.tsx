import { Avatar, Button, Container, Paper, Stack } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import React from 'react';
import HomeContents from '../components/HomeContents';
import TestsHistory from '../components/TestsHistory';
import connectToDatabase from '../db/connectToDatabase';
import { IUser } from '../schema/user.schema';

export default function Index({ user: currentUser }: { user: IUser; }) {
  const [user, setcurrentUser] = React.useState(currentUser);
  const [page, setPage] = React.useState(0);

  return <>
    <Head><title>Ascades - A Skin Cancer Detection Expert System</title></Head>
    <Container maxWidth="md">
      <Paper
        elevation={2}
        className='k3'
        sx={{ borderRadius: ".7rem" }}>
        <Stack
          my={2} py={1} px={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Stack
            spacing={2}
            direction="row"
            alignItems="center">
            <Button
              onClick={() => setPage(0)}
              size="small"
              variant='contained'
              className='white'> Home </Button>
            <Button
              onClick={() => setPage(1)}
              size="small"
              variant='contained'
              className='white'> About </Button>
            <Button
              onClick={() => setPage(2)}
              size="small"
              variant='contained'
              className='white'> Tests History </Button>
          </Stack>
          <Avatar
            sx={{ width: 50, height: 50 }}
            alt={user.name}
            src={user.image} />
        </Stack>
      </Paper>
      {page === 0 && <HomeContents user={user} />}
      {page === 2 && <TestsHistory user={user} />}
    </Container>
  </>;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const token = await getToken({ req: context.req });
  if (!token) return {
    redirect: {
      destination: '/sign-up',
      permanent: false
    }
  };
  const db = await connectToDatabase();
  if (!db) return {
    redirect: {
      destination: '/500',
      permanent: false
    }
  };
  const { User } = db.models;
  const user = await User.findOne({
    email: token.email
  });
  if (!user) return {
    redirect: {
      destination: '/sign-up',
      permanent: false
    }
  };
  return {
    props: { user: JSON.parse(JSON.stringify(user)) }
  };
};