'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function HouseDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const res = await fetch(`/api/houses/${id}`);
        const data = await res.json();
        setHouse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouse();
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}
      >
        <p className="text-white text-xl bg-black/40 p-3 rounded-lg">Loading house...</p>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">House not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}
    >
      <div className="backdrop-blur-sm bg-white/85 min-h-screen p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-md overflow-hidden">
          <img
            src={house.image}
            alt={house.title}
            className="w-full h-72 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{house.title}</h1>
            <p className="text-gray-600 mt-2">{house.location}</p>
            <p className="text-blue-700 text-lg font-semibold mt-2">
              ₦{house.price} / year
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">{house.description}</p>

            <div className="mt-6 flex justify-between">
              <Link
                href={`/chat/${house.agentId}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Chat with Agent 💬
              </Link>
              <Link
                href="/houses"
                className="text-gray-700 hover:underline font-medium"
              >
                ← Back to Houses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
