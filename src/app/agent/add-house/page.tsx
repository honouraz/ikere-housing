'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AddHouse() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [form, setForm] = useState({
    title: '',
    price: '',
    location: '',
    description: '',
    houseType: '',
    facilities: [] as string[],
  });

  // handle field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle facilities checkboxes
  const handleFacilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      facilities: checked
        ? [...prev.facilities, value]
        : prev.facilities.filter((f) => f !== value),
    }));
  };

  // upload to Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert('❌ Cloudinary credentials missing in environment variables.');
      return;
    }

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (json.secure_url) {
        setImageUrl(json.secure_url);
      } else {
        alert('❌ Image upload failed. Check Cloudinary setup.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('❌ Error uploading image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      alert('You must be logged in as an agent!');
      return;
    }
    if (!imageUrl) {
      alert('Please upload an image before submitting.');
      return;
    }

    setLoading(true);
    try {
      // Try to extract ID safely
      const agentId =
        (session.user as any)?.id ||
        (session.user as any)?._id ||
        (session.user as any)?.email ||
        'unknown';

      const res = await fetch('/api/houses/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          image: imageUrl,
          agentId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error('Add House Error:', result);
        alert(`❌ Failed to add house: ${result.error || 'Unknown error'}`);
      } else {
        alert('✅ House added successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('❌ An error occurred while adding the house.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url("/images/bg-pattern.jpg"), linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-md max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Property 🏠</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="House Title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₦)"
            value={form.price}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <select
            name="houseType"
            value={form.houseType}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="">Select House Type</option>
            <option value="Single Room">Single Room</option>
            <option value="Self Contain">Self Contain</option>
            <option value="Flat">Flat</option>
            <option value="Duplex">Duplex</option>
          </select>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={4}
            required
          />

          <div>
            <label className="block mb-2 font-medium">Facilities</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                'Fenced',
                'Toilet',
                'Water Supply',
                'Electricity',
                'Tiled Floor',
                'Kitchen',
                'Parking Space',
              ].map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="facilities"
                    value={item}
                    onChange={handleFacilitiesChange}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Upload Photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className="w-full h-40 object-cover mt-2 rounded"
              />
            )}
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
