import { prisma } from '@/db/prisma';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ['http://localhost:3000'],
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;

export async function getServerSession(): Promise<AuthSession | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}
