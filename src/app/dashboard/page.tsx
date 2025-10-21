// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface House {
  _id: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  image?: string;
  agentId?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [houses, setHouses] = useState<House[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.push('/login');
  }, [session, status, router]);

   useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch('/api/houses');
        if (res.ok) {
          const data = await res.json();
          // Filter houses depending on role
          if (session?.user?.role === 'agent') {
            const userId = (session.user as { id?: string }).id;
            setHouses(data.filter((h: House) => h.agentId === userId));
          } else {
            setHouses(data);
          }
        }
      } catch (err) {
        console.error('Failed to fetch houses:', err);
      }
    };

    if (session) fetchHouses();
  }, [session]);


  if (status === 'loading')
    return (
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}>
        <p className="text-white text-xl font-semibold bg-black/40 p-3 rounded-lg">Loading...</p>
      </div>
    );

  if (!session) return null;

  const user = session.user as { name?: string; role?: string; id?: string };
  const role = user?.role ?? 'student';

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed text-gray-900"
      style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}
    >
      <div className="backdrop-blur-sm bg-white/80 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user?.name ?? 'Guest'} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Role: <span className="capitalize font-semibold">{role}</span>
              </p>
            </div>

            {role === 'agent' && (
              <button
                onClick={() => router.push('/agent/add-house')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                <PlusCircle className="w-5 h-5" />
                Add House
              </button>
            )}
          </div>

          {/* Student View */}
          {role === 'student' && (
            <div className="bg-white/90 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">🏡 Available Houses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {houses.length > 0 ? (
                  houses.map(house => (
                    <div
                      key={house._id}
                      className="border rounded-lg overflow-hidden shadow-sm bg-gray-50 hover:shadow-md transition"
                    >
                      <img
                        src={house.image || '/images/default-house.jpg'}
                        alt={house.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-semibold text-lg text-gray-800">{house.title}</h4>
                        <p className="text-sm text-gray-500">₦{house.price}/year</p>
                        <div className="flex justify-between mt-3">
                          <a href={`/houses/${house._id}`} className="text-blue-600 hover:underline text-sm">
                            View
                          </a>
                          <a
                            href={`/chat/${house.agentId ?? ''}`}
                            className="text-indigo-600 hover:underline text-sm"
                          >
                            Chat 💬
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No houses available yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Agent View */}
          {role === 'agent' && (
            <div className="bg-white/90 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">📊 Your Listings</h3>
              {houses.length === 0 ? (
                <p className="text-gray-600">You haven’t added any houses yet.</p>
              ) : (
                <ul>
                  {houses.map(p => (
                    <li
                      key={p._id}
                      className="border-b py-3 flex justify-between items-center text-gray-700"
                    >
                      <span>{p.title}</span>
                      <div className="flex gap-3">
                        <a href={`/agent/edit/${p._id}`} className="text-blue-600 hover:underline">
                          Edit
                        </a>
                        <a href={`/chat/${p._id}`} className="text-indigo-600 hover:underline">
                          View Chats 💬
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
