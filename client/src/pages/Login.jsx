import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Layers, ArrowRight, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('alex@meridian.app');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col justify-center items-center p-4">
      {/* Container */}
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-[#E2E8F0] space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Layers className="w-6 h-6 text-[#22D3EE]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Welcome back</h1>
          <p className="text-xs text-[#64748B] font-medium">Log in to your Meridian workspace & flowcharts</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Demo Account Callout */}
        <div className="p-3.5 bg-[#22D3EE]/15 border border-[#22D3EE]/40 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#0F172A]" />
            <span>Demo Account Ready</span>
          </div>
          <p className="text-[#64748B]">Click sign in below using pre-filled credentials to explore.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div>
            <label className="block text-[#0F172A] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#0F172A] font-medium focus:ring-2 focus:ring-[#0F172A] focus:outline-none"
              placeholder="alex@meridian.app"
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#0F172A] hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
