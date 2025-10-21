// src/app/dashboard/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function HouseDetail() {
  const { id } = useParams();
  const [house, setHouse] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchHouse() {
      const res = await fetch(`/api/houses/${id}`);
      const data = await res.json();
      setHouse(data);
    }

    fetchHouse();
  }, [id]);

  if (!house) return <p className="text-center mt-10">Loading house details...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{house.title}</h1>
      <p className="text-gray-600 mb-2">{house.location}</p>
      <p className="text-green-600 font-bold mb-4">₦{house.price}</p>
      <p>{house.description}</p>
    </div>
  );
}
