'use client';

import { useEffect } from 'react';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Firebase on client side
    import('@/lib/firebase');
  }, []);

  return <>{children}</>;
}
