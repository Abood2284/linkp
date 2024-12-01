// apps/linkp-website/components/templates/shared/TrackedLink.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

interface TrackedLinkProps {
  href: string;
  linkId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function TrackedLink({ href, linkId, children, className, style }: TrackedLinkProps) {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isClicking) return;

    setIsClicking(true);
    try {
      // Record click
      await fetch('/api/links/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      });

      // Navigate to URL
      window.open(href, '_blank', 'noopener,noreferrer');
    } finally {
      setIsClicking(false);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      style={style}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </Link>
  );
}