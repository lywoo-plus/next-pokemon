import { AuthForm } from '@/app/(auth)/_components/auth-form';
import { getServerSession } from '@/lib/auth';
import NavLinkFeatures from './_components/nav-link-features';

export default async function Page() {
  const session = await getServerSession();

  return (
    <section className="mx-auto mt-2 w-sm">
      {session ? <NavLinkFeatures /> : <AuthForm />}
    </section>
  );
}
