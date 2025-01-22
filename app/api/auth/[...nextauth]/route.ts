import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/app/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      avatarUrl?: string | null;
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
          required: true, // Explicit required
        },
        password: {
          label: 'Password',
          type: 'password',
          required: true,
        },
      },
      async authorize(credentials) {
        try {
          // Strict validation
          if (!credentials || !credentials.email || !credentials.password) {
            throw new Error('Invalid credentials format');
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email.trim().toLowerCase() },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              avatarUrl: true,
            },
          });

          if (!user) throw new Error('User not found');

          const isValid = await compare(credentials.password, user.password);
          if (!isValid) throw new Error('Invalid password');

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl || null,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
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
        token.avatarUrl = user.avatarUrl; // Dodajemy avatarUrl do tokena
      } else {
        // Aktualizacja danych z bazy przy każdym odświeżeniu tokena
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            name: true,
            email: true,
            avatarUrl: true, // Pobieramy aktualny avatarUrl
          },
        });

        if (dbUser) {
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.avatarUrl = dbUser.avatarUrl; // Aktualizujemy avatarUrl
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string | null,
        avatarUrl: token.avatarUrl as string | null, // Dodajemy do sesji
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
