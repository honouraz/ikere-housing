// src/app/dashboard/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddHouse() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/houses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert('House added successfully!');
      router.push('/dashboard');
    } else {
      alert('Failed to add house.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Add New House</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="House Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price (₦)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Save House
        </button>
      </form>
    </div>
  );
}
