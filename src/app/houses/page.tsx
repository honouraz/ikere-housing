'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type House = {
  _id: string;
  title: string;
  location?: string;
  price?: number;
  image?: string;
  agentId?: string;
  houseType?: string;
  facilities?: string[];
  description?: string;
};

export default function HousesPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterFacility, setFilterFacility] = useState('');

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch('/api/houses');
        const data = await res.json();
        setHouses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('fetch houses error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}
      >
        <p className="text-white text-xl bg-black/40 p-3 rounded-lg">Loading houses...</p>
      </div>
    );
  }

  // Filtering logic
  const filteredHouses = houses.filter((h) =>
    (filterType ? h.houseType === filterType : true) &&
    (filterFacility ? (h.facilities || []).includes(filterFacility) : true) &&
    (search ? (h.location || '').toLowerCase().includes(search.toLowerCase()) : true)
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}
    >
      <div className="backdrop-blur-sm bg-white/80 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">🏡 Available Houses</h1>

          {/* Filter Section */}
          <div className="mb-8 flex flex-wrap gap-4 justify-center">
            <input
              type="text"
              placeholder="Search location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-md w-60"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">All Types</option>
              <option value="Single Room">Single Room</option>
              <option value="Self Contain">Self Contain</option>
              <option value="Flat">Flat</option>
              <option value="Duplex">Duplex</option>
            </select>

            <select
              value={filterFacility}
              onChange={(e) => setFilterFacility(e.target.value)}
              className="p-2 border rounded-md"
            >
              <option value="">Any Facility</option>
              <option value="Fenced">Fenced</option>
              <option value="Toilet">Toilet</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Parking Space">Parking Space</option>
            </select>
          </div>

          {/* Houses grid */}
          {filteredHouses.length === 0 ? (
            <p className="text-center text-gray-600">No houses match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredHouses.map((house) => (
                <div key={house._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <img src={house.image || '/images/placeholder.jpg'} alt={house.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{house.title}</h3>
                    <p className="text-gray-500">{house.location}</p>
                    <p className="text-blue-600 font-medium mt-1">₦{house.price}</p>
                    <div className="mt-4 flex justify-between">
                      <Link href={`/houses/${house._id}`} className="text-indigo-600 hover:underline text-sm">View Details</Link>
                      <Link href={`/chat/${house.agentId}`} className="text-blue-600 hover:underline text-sm">Chat 💬</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
