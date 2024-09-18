import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import db from '@/utils/db';

import clientPromise from '@/lib/mongodb';
import { User } from '@/models/User';

db.connectDb();

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        await db.connectDb();

        const email = credentials.email;
        const password = credentials.password;
        const user = await User.findOne({ email });

        if (user) {
          return SignInUser({ password, user });
        } else {
          throw new Error('This email does not exist');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const user = await User.findById(token.sub);
      session.user.id = token.sub || user._id.toString();
      session.user.role = user.role || 'user';
      token.role = user.role || 'user';
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        domain: '.telejkam.uz',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    },
  },
  secret: process.env.JWT_SECRET,
});

const SignInUser = async ({ password, user }) => {
  if (!user.password) {
    throw new Error('Please enter your password');
  }

  const textPassword = await bcrypt.compare(password, user.password);

  if (!textPassword) {
    throw new Error('Email or password is wrong');
  }
  return user;
};
