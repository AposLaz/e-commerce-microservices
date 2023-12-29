import type { DefaultSession, DefaultUser, User, Session } from 'next-auth';

declare module 'next-auth' {
    interface User extends DefaultUser {
        jwt?: string;
        username?: string;
    }

    interface Session extends DefaultSession {
        accessToken?: string;
    }
}