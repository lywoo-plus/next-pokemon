import { getServerSession } from '@/features/auth/auth-server';
import { AuthForm } from '@/features/auth/components/auth-form';
import AuthNavLinks from '@/features/auth/components/auth-nav-links';

export default async function Page() {
  const session = await getServerSession();

  return (
    <section className="mx-auto mt-2 w-sm">
      {session ? <AuthNavLinks /> : <AuthForm />}
    </section>
  );
}
