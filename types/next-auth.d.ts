import NextAuth from 'next-auth';
import { User as PrismaUser } from '.prisma/client';

declare module 'next-auth' {
    interface Session {
        user: PrismaUser;
    }

    interface User extends PrismaUser {}
}
