import { PrismaClient } from '@prisma/client';

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

// client.$use(async (params, next) => {
//     if (params.model == 'EloUpdate' && params.action == 'create') {
//         const result = await next(params);
        
//     }
// });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export default client;
