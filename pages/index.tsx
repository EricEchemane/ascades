import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import React from 'react';
import connectToDatabase from '../db/connectToDatabase';
import { IUser } from '../schema/user.schema';

export default function Index({ user }: { user: IUser; }) {
  const [current, setcurrentUser] = React.useState(user);
  console.log(user);

  return (
    <div>Index</div>
  );
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