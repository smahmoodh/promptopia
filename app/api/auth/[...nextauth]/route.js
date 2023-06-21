import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import User from "@models/user";
import { connectToDB } from "@utils/database";

const handler = NextAuth({
// Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
        // ...add more providers here
    ],
    callbacks:{
        async session({ session }) {
            const sessionUser = await User.findOne({
                email: session.user.email
            })
        },
        async signIn({ profile }) {
            try {
                await connectToDB();
                const userExists = await User.findOne({
                    email: profile.email
                });

                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.username.replace(" ", "").toLowerCase(),
                        import: profile.picture
                    })
                }

                return true;
            } catch (error) {
                console.log("///////////////////////////////////");
                console.log("callback error");
                console.log(error);
                console.log("///////////////////////////////////");
                return false;
            }
        }
    }
})

export { handler as GET, handler as POST };