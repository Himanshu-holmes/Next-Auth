import prisma from "@/lib/prisma";
import NextAuth, { getServerSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "Username",
          type: "username",
          placeholder: "username",
        },
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if(!credentials)return null;
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials?.email!,
              username: credentials?.username!,
            },
          });
          console.log("user", user);
          if (!user) return null;
            if(!user.isVerified ) {
              throw new Error("Please verify your account first");
            }
            if(!user.password){
              throw new Error("Please Provide password");
            }

          let isPasswordCorrect = await bcrypt.compare(
            credentials?.password!,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }
          return user;
        } catch (error: any) {
          console.log(error);
          return null;
        }
      },
    }),
    // ...add more providers here
  ],
  // pages:{
  //   signIn: '/signin',
  //   signOut: '/signout',
  //   error: '/error',

  // },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user?.id!.toString();
        token.isVerified = user?.isVerified;
        token.email = user?.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
      }
      return session;
    },
    async signIn(params) {
      console.log("signIn params", params);
      
      let existingUser = await prisma.user.findUnique({
        where: {
          email: params.user.email,
        },
      });
      if(existingUser){

        // if there is an existing user with the same email and type, return true

        if(existingUser.type === params.account?.type)return true
        
        // Check if an account with the same email and type already exists
        const emailConflictAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
 
          },
        });
        console.log("emailConflictAccount", emailConflictAccount);
        if(emailConflictAccount){
          console.log("emailConflictAccount", emailConflictAccount);
          return true;
        }

        console.log("linking account");
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            providerAccountId: params.user!.id!.toString(),
            provider: params.account!.provider,
            // type: params.account?.type,
            name: params?.user?.name!,
          },
        });
        return true
      }
      
      await prisma.user.create({
        data: {
          email: params.user!.email!,
          name: params.user!.name!,
          type: params.account!.type!,
          isVerified: true,
          accounts: {
            create : {
              providerAccountId: params.user.id!.toString(),
              provider: params.account!.provider!,
              name: params.user!.name!,
            }  ,
          },
        },
      })
         return true;
    },
  },
};

export default NextAuth(authOptions);
