'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Mail, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false
    });
    
    setLoading(false);
    
    if (result?.ok) {
      router.push('/dashboard');
      router.refresh();
    } else if (result?.error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg.jpg')] bg-cover bg-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            <img src="/logo.png" alt="BOUESTI Housing Logo" width={64} height={64} className="mx-auto"/>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">BOUESTI STUDENT HOUSING</h2>
          <p className="mt-2 text-sm text-gray-600">Fair rent for students</p>
          <p className="mt-2 text-sm text-gray-600">This portal is for BOUESTI student seeking accomodations at cheper rate and to avoid fraud.</p>
        </div>
        
        <form className="bg-white p-8 rounded-xl shadow-lg space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="text-center">
            <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
              Create new account →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}