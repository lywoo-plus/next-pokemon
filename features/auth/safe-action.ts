import { createSafeActionClient } from 'next-safe-action';
import { getServerSession } from './auth-server';

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error(error);

    return error instanceof Error ? error.message : 'Something went wrong';
  },
});

export const protectedActionClient = actionClient.use(async ({ next }) => {
  const session = await getServerSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  return next({
    ctx: {
      session,
    },
  });
});
