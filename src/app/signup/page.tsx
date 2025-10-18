'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', role: 'student' as 'student' | 'agent' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert('Account created! Check email for verification.');
        router.push('/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Network error');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Join BOUESTI student housing scheme.</h2>
          <h3 className="text-sm text-gray-600">Create your account</h3>
        </div>
        
        <form className="bg-white p-8 rounded-xl shadow-lg space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
          
          <select
            value={form.role}
            onChange={(e) => setForm({...form, role: e.target.value as any})}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="student">🧑‍🎓 Student</option>
            <option value="agent">🏠 Verified Agent</option>
          </select>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          
          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Already have account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}