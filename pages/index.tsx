import { Avatar, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';
import React from 'react';
import HomeContents from '../components/HomeContents';
import TestsHistory from '../components/TestsHistory';
import connectToDatabase from '../db/connectToDatabase';
import { IUser } from '../schema/user.schema';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import About from '../components/About';

export default function Index() {
  const [user, setcurrentUser] = React.useState();
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    fetch("/api/get-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setcurrentUser(data.data);
        }
        else {
          router.replace('/sign-up');
          return;
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || !session) return <div>loading...</div>;

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
            alt={(user as any).name}
            src={(user as any).image} />
        </Stack>
      </Paper>
      {page === 0 && <HomeContents user={user} />}
      {page === 1 && <About />}
      {page === 2 && <TestsHistory user={user} />}
    </Container>

    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"PRIVACY POLICY"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" component="div">
          <Typography>
            Last Updated: September 29, 2022
          </Typography>
          <Typography mt={2}>
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Website and tells about Your privacy rights and how the law protects You.
          </Typography>
          <Typography mt={2}>
            We use Your Personal data  to create an account for You to access our Website. You agree to the collection and use of information in accordance with this Privacy Policy.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  </>;
}


// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const token = await getToken({ req: context.req });
//   if (!token) return {
//     redirect: {
//       destination: '/sign-up',
//       permanent: false
//     }
//   };
//   const db = await connectToDatabase();
//   if (!db) return {
//     redirect: {
//       destination: '/500',
//       permanent: false
//     }
//   };
//   const { User } = db.models;
//   const user = await User.findOne({
//     email: token.email
//   });
//   if (!user) return {
//     redirect: {
//       destination: '/sign-up',
//       permanent: false
//     }
//   };
//   return {
//     props: { user: JSON.parse(JSON.stringify(user)) }
//   };
// };