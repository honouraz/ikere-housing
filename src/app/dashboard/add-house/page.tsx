'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type FormElements = HTMLFormElement & {
  title: HTMLInputElement;
  location: HTMLInputElement;
  price: HTMLInputElement;
  houseType: HTMLSelectElement;
  description: HTMLTextAreaElement;
  // image handled separately via cloudinary upload (string URL)
};

export default function AddHousePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  // Cloudinary upload helper (keeps same approach you used)
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    // upload
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: data }
    );
    const json = await res.json();
    setImageUrl(json.secure_url);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // e.currentTarget is typed as the form element
    const form = e.currentTarget as FormElements;

    // gather facilities from checked inputs named "facilities"
    const fd = new FormData(form);
    const facilities = fd.getAll('facilities').map((v) => String(v));

    const newHouse = {
      title: form.title.value,
      location: form.location.value,
      price: Number(form.price.value || 0),
      houseType: form.houseType.value,
      facilities,
      agentId: (session?.user as any)?.id || '',
      image: imageUrl || '', // must be set via upload before submit
      description: form.description.value,
    };

    try {
      const res = await fetch('/api/houses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHouse),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Add house failed', err);
        alert('Failed to add house');
      } else {
        alert('House added successfully');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{ backgroundImage: 'url("/images/bg-pattern.jpg")' }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Property 🏠</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="House Title"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full p-3 border rounded-lg"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (₦)"
            className="w-full p-3 border rounded-lg"
            required
          />

          <select name="houseType" className="w-full p-3 border rounded-lg" required>
            <option value="">Select type</option>
            <option value="Single Room">Single Room</option>
            <option value="Self Contain">Self Contain</option>
            <option value="Flat">Flat</option>
            <option value="Duplex">Duplex</option>
          </select>

          <textarea
            name="description"
            placeholder="Description"
            className="w-full p-3 border rounded-lg"
            rows={4}
          />

          <div>
            <label className="block mb-2 font-medium">Facilities</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {['Fenced', 'Toilet', 'Water Supply', 'Electricity', 'Tiled Floor', 'Kitchen', 'Parking Space'].map(
                (item) => (
                  <label key={item} className="flex items-center space-x-2">
                    <input type="checkbox" name="facilities" value={item} />
                    <span>{item}</span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Upload Photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-40 object-cover mt-2 rounded" />}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
          >
            {loading ? 'Uploading...' : 'Add House'}
          </button>
        </form>
      </div>
    </div>
  );
}
