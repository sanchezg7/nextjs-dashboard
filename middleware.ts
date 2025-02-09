import NextAuth from 'next-auth';
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
    /**
     * https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
     * Specify what paths middleware should run
     */
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};