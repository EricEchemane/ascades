import { Avatar, Container, Paper, Stack, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import React from 'react';
import connectToDatabase from '../db/connectToDatabase';
import { IUser } from '../schema/user.schema';

export default function Index({ user }: { user: IUser; }) {
  const [current, setcurrentUser] = React.useState(user);

  return <>
    <Head><title>Ascades - A Skin Cancer Detection Expert System</title></Head>
    <Container maxWidth="md">
      <Paper elevation={2} sx={{ borderRadius: "1rem" }}>
        <Stack
          my={4} px={3} py={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Typography variant='h4'>
            {user.name}
          </Typography>
          <Avatar
            sx={{ width: 50, height: 50 }}
            alt={user.name}
            src={user.image} />
        </Stack>
      </Paper>
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