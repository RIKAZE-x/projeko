'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrialPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/game');
  }, [router]);

  return (
    <main className="rpg-shell" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <section className="panel" style={{ maxWidth: 560, width: 'calc(100% - 32px)' }}>
        <span className="eyebrow">VEILBOUND TRIAL</span>
        <h1>Preparing your expedition…</h1>
        <p>The trial build is loading the current playable dungeon slice.</p>
      </section>
    </main>
  );
}
