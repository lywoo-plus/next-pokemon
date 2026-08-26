'use client';

import { NAV_LINKS } from '@/consts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function NavLinkFeatures() {
  return (
    <nav className="flex items-center justify-center gap-4">
      <ul className="flex gap-4">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'grid size-full place-content-center rounded-md border border-yellow-500 p-4 text-center hover:border-2 hover:border-yellow-400 md:size-52',
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
