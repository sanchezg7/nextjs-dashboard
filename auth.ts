import NextAuth from 'next-auth';
import {authConfig} from "./auth.config";
import Credentials from 'next-auth/providers/credentials';
import {z} from 'zod';
import type {User} from '@/app/lib/definitions';
import bcrypt from "bcrypt";
import postgres from "postgres";
import * as process from "node:process";

const sql = postgres(process.env.POSTGRES_URL!, { });

async function getUser(email: string): Promise<User | undefined>{
    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const {auth, signIn, signOut} = NextAuth({
    ...authConfig,
    /**
     * There are various providers such as Google or Github. Credentials for now.
     */
    providers: [Credentials({
        async authorize(credentials) {
            /**
             * Similarly to Server Actions, you can use zod to validate the email and password before checking if the user exists in the database:
             */
            const parsedCredentials = z
                .object({email: z.string().email(), password: z.string().min(6)})
                .safeParse(credentials)

            if(parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if(!user){
                    return null
                }
                const passwordMatch = await bcrypt.compare(password, user.password);
                if(passwordMatch){
                    console.log('Password match');
                    return user;
                } else {
                    console.log('Password does not match');
                }
            }

            return null;
        }
    })]
});