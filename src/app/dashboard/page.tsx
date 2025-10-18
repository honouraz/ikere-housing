'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log('Session:', session);
console.log('Status:', status);


  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const { user } = session;
  const role = user?.role || 'student';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <p className="text-gray-600 mt-2">Role: <span className="capitalize">{role}</span></p>
        </div>

        {role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">🏠 Browse Houses</h3>
              <a href="/houses" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded inline-block">Browse</a>
            </div>
          </div>
        )}

        {role === 'agent' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">➕ Add Property</h3>
              <a href="/agent/add-house" className="mt-4 bg-green-600 text-white px-4 py-2 rounded inline-block">Add House</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}