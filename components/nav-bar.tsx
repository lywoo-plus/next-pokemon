'use client';

import { NAV_LINKS } from '@/consts';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 grid grid-cols-3 p-4 backdrop-blur-2xl">
      <Link href="/" className="block">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/330px-International_Pok%C3%A9mon_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail&_=20250519141241"
          alt="logo"
          width={120}
          height={120}
        />
        <p className="text-xs capitalize">my pokemon collection</p>
      </Link>

      <section
        className={cn(
          'flex items-center justify-center gap-4',
          pathname === '/' && 'hidden',
        )}
      >
        <ul className="flex gap-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn('p-4 hover:border-b-2 hover:border-yellow-500', {
                  'border-b-2 border-yellow-500': link.href === pathname,
                })}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  );
}
