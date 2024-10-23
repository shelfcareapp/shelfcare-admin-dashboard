'use client';

import { auth } from '../../firebase';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  // use is not signed in, redirect to sign in page
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) {
    router.push('/sign-in');
  }

  if (user) {
    router.push('/chats');
  }

  return (
    <div className="flex items-center justify-center">
      <h1 className="text-4xl font-bold">Shelfcare Admin Dashboard</h1>
    </div>
  );
}
