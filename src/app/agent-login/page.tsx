'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RouteRedirect from '@/components/RouteRedirect';

export default function AgentLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new unified auth page with agent tab
    router.push('/auth?tab=agent');
  }, [router]);

  return <RouteRedirect />;
}