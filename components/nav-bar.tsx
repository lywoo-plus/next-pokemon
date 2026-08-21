'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    href: '/pokemon',
    label: 'My Collection',
  },
  {
    href: '/pokemon/new',
    label: 'New',
  },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 grid grid-cols-3 p-4 backdrop-blur-2xl">
      <Link href="/" className="block">
        <h1 className="text-3xl font-bold">Pokemon</h1>
        <p className="text-xs capitalize">my pokemon collection</p>
      </Link>

      <section className="flex items-center justify-center gap-4">
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn('p-4 hover:border-b-2', {
                  'border-b-2': link.href === pathname,
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
