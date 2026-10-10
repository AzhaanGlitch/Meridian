import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#E2E8F0] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Layers className="w-6 h-6 text-[#A3E635]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Create Meridian Account</h1>
          <p className="text-xs text-[#64748B] font-medium">Start planning goals, mindmaps, and roadmaps</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-[#0F172A] mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#0F172A] font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              placeholder="e.g. Alex Morgan"
            />
          </div>

          <div>
            <label className="block text-[#0F172A] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#0F172A] font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label className="block text-[#0F172A] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#0F172A] font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              placeholder="Minimum 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#0F172A] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
