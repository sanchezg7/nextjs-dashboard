import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        /**
         * Use to verify if request is authorized with Next.js Middleware
         * @param auth
         * @param nextUrl
         */
        authorized({ auth, request : { nextUrl }}) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if(isOnDashboard) {
                return isLoggedIn; // false redirects to login page
            } else if(isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        }
    },
    providers: []
} satisfies NextAuthConfig;