import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/');
  }

  return (
    <section className="my-8 flex flex-col gap-4 px-4 md:mx-auto md:flex-row">
      {children}
    </section>
  );
}
