import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();

  console.log('Session:', session); // Debug log
  console.log('Status:', session ? 'authenticated' : 'unauthenticated'); // Debug log

  if (!session?.user) {
    redirect('/login');
    return null; // Optional, but ensures no render if redirecting
  }

  // ✅ Get user safely
  const user = session.user;
  const role = user?.role ?? 'student';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name ?? 'Guest'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Role: <span className="capitalize">{role}</span>
          </p>
        </div>

        {/* Student view */}
        {role === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">🏠 Browse Houses</h3>
              <a
                href="/houses"
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded inline-block"
              >
                Browse
              </a>
            </div>
          </div>
        )}

        {/* Agent view */}
        {role === 'agent' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold">➕ Add Property</h3>
              <a
                href="/agent/add-house"
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded inline-block"
              >
                Add House
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}