'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { NAV_LINKS } from '@/consts';
import { signOut, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();

  async function handleSignOut() {
    const result = await signOut();

    if (result.error) {
      toast.error(result.error.message ?? 'Failed to sign out');
      return;
    }

    toast.success('Signed out');
    router.replace('/');
    router.refresh();
  }

  return (
    <nav className="sticky top-0 grid grid-cols-3 items-start p-4 backdrop-blur-2xl">
      <Link href="/" className="block">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/330px-International_Pok%C3%A9mon_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20250519141241"
          alt="logo"
          width={120}
          height={120}
        />
        <p className="text-xs capitalize">my pokemon collection</p>
      </Link>

      <section className={cn('flex items-center justify-center gap-4')}>
        <ul className="flex gap-4">
          {pathname !== '/' &&
            NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'p-4 hover:border-b-2 hover:border-yellow-500',
                    {
                      'border-b-2 border-yellow-500': link.href === pathname,
                    },
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <section className="flex justify-end">
        {session.data ? (
          <Button variant="destructive" type="button" onClick={handleSignOut}>
            Sign out
          </Button>
        ) : (
          pathname !== '/' && (
            <Link href="/" className={buttonVariants({ variant: 'outline' })}>
              Login
            </Link>
          )
        )}
      </section>
    </nav>
  );
}
