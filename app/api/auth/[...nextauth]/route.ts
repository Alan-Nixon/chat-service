import { postLogin } from '@/app/(functions)/userFunction';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

declare module 'next-auth' {
    interface Session {
        _id: string;
        userName: string;
        Phone: string;
        profileImage?: string;
        IsAdmin: boolean;
        IsBlocked: boolean;
        Email: string
        blockedUsers: string[]

    }

    interface User {
        _id: string;
        id: string;
        email: string;
        userName: string;
        Phone: number;
        profileImage: string;
        IsAdmin: boolean;
        blockedUsers: string[] | []
        IsBlocked: boolean;
    }

    interface JWT {
        _id: string;
        id: string;
        email: string;
        userName: string;
        Phone: number;
        profileImage: string;
        IsAdmin: boolean;
        IsBlocked: boolean;
    }
}

const AUTHENTICATION = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const { data, status } = await postLogin({
                        Email: credentials?.email + "",
                        Password: credentials?.password + ""
                    });
                    if (status && data) {
                        return {
                            _id: data._id,
                            id: data._id,
                            email: data.Email,
                            userName: data.userName,
                            Phone: data.Phone,
                            profileImage: data.profileImage,
                            IsAdmin: data.IsAdmin,
                            IsBlocked: data.IsBlocked,
                            blockedUsers: data.blockedUsers
                        };
                    } else {
                        return null;
                    }
                } catch (error: any) {
                    console.error("Error in login:", error.message);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
                token.id = user.id;
                token.email = user.email;
                token.userName = user.userName;
                token.Phone = user.Phone;
                token.profileImage = user.profileImage;
                token.IsAdmin = user.IsAdmin;
                token.IsBlocked = user.IsBlocked;
                token.blockedUsers = user.blockedUsers
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session._id = token._id as string;
                session.userName = token.userName as string;
                session.Phone = token.Phone as string;
                session.profileImage = token.profileImage as string;
                session.IsAdmin = token.IsAdmin as boolean;
                session.IsBlocked = token.IsBlocked as boolean;
                session.Email = token.email as string
                session.blockedUsers = token.blockedUsers as string[]

            }
            return session;
        },
    },
});

export { AUTHENTICATION as GET, AUTHENTICATION as POST };
