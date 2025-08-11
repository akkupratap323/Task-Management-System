'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RouteRedirect from '@/components/RouteRedirect';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new unified auth page
    router.push('/auth');
  }, [router]);

  return <RouteRedirect />;
}