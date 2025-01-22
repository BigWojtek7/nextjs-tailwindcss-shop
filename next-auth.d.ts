import 'next-auth';

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
    avatarUrl?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    avatarUrl?: string | null;
  }
}
