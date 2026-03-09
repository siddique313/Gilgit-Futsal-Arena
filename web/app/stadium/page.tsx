'use client';

import dynamic from 'next/dynamic';

const StadiumScene = dynamic(() => import('@/components/three/StadiumScene').then((m) => m.StadiumScene), {
  ssr: false,
  loading: () => <div className="flex h-screen items-center justify-center bg-muted text-muted-foreground">Loading stadium…</div>,
});

export default function StadiumPage() {
  return (
    <div className="h-screen w-full">
      <StadiumScene />
    </div>
  );
}
