import { getUser, postLogin } from '@/app/(functions)/userFunction';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sign } from 'jsonwebtoken';

declare module 'next-auth' {
    interface Session {
        _id: string;
        userName: string;
        Phone: string;
        profileImage?: string;
        IsAdmin: boolean;
        IsBlocked: boolean;
        Email: string;
        blockedUsers: string[];
        accessToken?: string;
    }

    interface User {
        _id: string;
        id: string;
        email: string;
        userName: string;
        Phone: number;
        profileImage: string;
        IsAdmin: boolean;
        blockedUsers: string[] | [];
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
        accessToken?: string;
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
                } catch (error) {
                    console.error("Error in login:", error);
                    return null;
                }
            },
        }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                console.log("calling every time")
                token._id = user._id;
                token.id = user.id;
                token.email = user.email;
                token.userName = user.userName;
                token.Phone = user.Phone;
                token.profileImage = user.profileImage;
                token.IsAdmin = user.IsAdmin;
                token.IsBlocked = user.IsBlocked;
                token.blockedUsers = user.blockedUsers;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                const { data } = await getUser(token?._id + "")
                const userToken = sign(data, process.env.NEXT_PUBLIC_JWT_SECRET_KEY + "", { expiresIn: "1d" }) as string
                session._id = data._id as string;
                session.userName = data.userName as string;
                session.Phone = data.Phone as string;
                session.profileImage = data.profileImage as string;
                session.IsAdmin = data.IsAdmin as boolean;
                session.IsBlocked = data.IsBlocked as boolean;
                session.Email = token.email as string;
                session.blockedUsers = data.blockedUsers as string[];
                session.accessToken = userToken
            }
            return session;
        },
    },
});

export { AUTHENTICATION as GET, AUTHENTICATION as POST };
