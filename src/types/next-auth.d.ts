import 'next-auth';

declare module 'next-auth' {
    interface User {
      id?: string;
      email?: string;
      isVerified?: boolean;
      verifyCodeExpiry?: string;
      name?: string;
    }
    interface Session {
      user: User;
    } 
}

declare module 'next-auth/jwt' {
    interface JWT {
      id?: string;
      email?: string;
      isVerified?: boolean;
    }
}