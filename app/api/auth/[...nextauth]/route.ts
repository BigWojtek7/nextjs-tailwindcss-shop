import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@domain.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && (await compare(credentials.password, user.password))) {
          return { id: user.id, name: user.name, email: user.email };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dni
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      } else {
        // Pobierz najnowsze dane użytkownika z bazy danych
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true },
        });

        if (dbUser) {
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string | null,
      };
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
